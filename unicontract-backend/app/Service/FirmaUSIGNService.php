<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Models\FirmaUSIGN;
use DB;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\FirmaUSIGNClient;
use App\Repositories\PrecontrattualeRepository;
use App\Service\PrecontrattualeService;


class FirmaUSIGNService implements CancellazioneServiceInterface
{
    public FirmaUSIGNClient $client;
    public function __construct()
    {
        $this->client = new FirmaUSIGNClient();
    }
   
    public function retry($func, array $args){

        $retries = 4;
        $response = null;
        for ($try = 0; $try < $retries; $try++) {

            $response =   $this->client->{$func}(...$args);
            if ($response->successful()){
                return $response;                
            }

            Log::info('[Retry] '.$try);                                                          
            sleep(3);                            
        }
        return $response;
    }

    public function userInfoValidCertificate($email){
        //...
        //     "isDeleted": false,
        //     "certificate": {
        //       "id": 1527193,
        //       "aliasCertificato": "CPPMRC87H26L500A_UNIURB",
        //       "dataDiRevoca": null,
        //       "dtInizioVldt": 1676968329000,
        //       "dtFineVldt": 1771981200000,
        //       "tipoOtp": "TSMS",
        //       "status": "VALID"
        //     }
        
        $response = $this->client->userInfo($email);
        if (!$response->successful()){    
            return false;         
        }
        $data = $response->json();
        if ($data['certificate']){
            if ($data['certificate']['status'] == 'VALID'){
                return true;
            }
        }
        return false;

    }

    public function richiestaFirmaUSIGN($pre, $firma = null){
        //valuta esistenza di una richiesta e eventuale aggiornamento    
        if ($firma==null){
            $firma = $pre->latestFirmaUSIGNnotRejected();            
            //$firma = FirmaUSIGN::where('precontr_id',$pre->id)->whereIn('stato',['active','success'])->orderby('created_at', 'desc')->first();            
        }
        
        if ($firma){  
            //Dalla documentazion di U-Sign viene usato il termine stato per identificare sia lo step che lo stato: Restituisce lo stato del processo identificato dal token, che può assumere 
            //i seguenti valori: Upload, Confirm, Sent-to-user, Otp, Completed .
            //lo step va su refused
            $result = $this->updateFirmaWithStep($firma->process_id, $firma);
            //lo status va su rejected
            $result = $this->updateFirmaWithStatus($firma->process_id, $firma);

            if (!$result['success']){        
                return $result;
            }

            $firma = $result['data'];        
               
            //Primo Step (Caricamento file)
            //Secondo Step (Conferma)
            //Terzo step (Presente solo qualora l'utente creatore del processo, non sia lo stesso utente che si occupa di firmarlo):
            //Quarto step (OTP inviato)
            //Quinto Step (Terminato / Terminato con errori)
            
            // Valuta gli step successivi in base allo stato
            switch ($firma->step) {             
                case 'upload':
                    //Upload: in questo step è possibile effettuare l’upload dei documenti;
                    if ($firma->file_id== null){
                        //occorre un certo tempo per fare la chiusura dell'upload ...
                        return $this->uploadAndFinish($firma->process_id, $pre, $firma);

                    } else {
                        return $this->uploadFinished($firma->process_id, $pre, $firma);                        
                    }                                                                                                                                                                         

                case 'confirm':
                     // Confirm: in questo step è possibile vedere un riepilogo, ma non possono essere apportate modifiche;
                     return $this->createSuccessResponse('Richiesta di firma creata correttamente.', $firma);   
                   
                case 'sent-to-user':
                    //in modalità ASINCRONA recupera il link e giralo all'utente
                    
                    return $this->getLink($firma->process_id, $firma);
                    // Sent-to-user: step intermedio visualizzato nel caso in cui il processo sia stato creato e assegnato ad un altro utente.
                    //return $this->createSuccessResponse('Richiesta di firma creata correttamente.', $firma);    
                
                case 'send-otp':
                    // Otp: il processo è in attesa dell’inserimento della coppia pin/otp per completare l’attività di firma;
                    return $this->createSuccessResponse('Richiesta di firma creata correttamente. Accedere in U-Sign per completare il processo di firma.', $firma);   

                case 'otp':
                    // Otp: il processo è in attesa dell’inserimento della coppia pin/otp per completare l’attività di firma;
                    return $this->createSuccessResponse('Richiesta di firma creata correttamente, inserire pin e OTP di firma.', $firma);   
                 
                case 'completed': 
                    // Completed: il processo è terminato e tutti i documenti sono stati firmati.                   
                    return $this->documentoFirmato($pre->insegn_id, $firma->process_id, $firma->file_id);        

                case 'finished':
                    if ($firma->stato == 'success'){
                        // Completed: il processo è terminato e tutti i documenti sono stati firmati.                        
                        return $this->documentoFirmato($pre->insegn_id, $firma->process_id, $firma->file_id);         
                    }else {
                        return $this->createSuccessResponse('Processo di firma fallito.', $firma);  
                    }                        

                case 'refused':
                    return $this->createSuccessResponse('Processo di firma rifiutato dal docente. '.$firma->rejections, $firma);   

                case 'cancelled':
                    return $this->createSuccessResponse('Processo di firma cancellato. '.$firma->rejections, $firma);   

                case 'expired':
                    return $this->createSuccessResponse('Processo di firma scaduto.', $firma);  

                case 'failed':
                    return $this->createSuccessResponse('Processo di firma fallito. '.$firma->rejections, $firma); 
                   
            }
        }else{
            return $this->createProcessFirma($pre);                       
        }            
    }

    
    public function createProcessFirma($pre){
      
        $email = $pre->user->email;
        $name = 'UniContr'; // 'di sistema, per conto del Responsabile Gianluca Antonelli Ufficio Amministrazione e Reclutamento Personale Docente'; 
        $cf = $pre->user->cf;
        if (App::environment(['local','preprod','testing'])) {             

            $email = 'enrico.oliva@uniurb.it';                      
            $cf = 'LVONRC76C29L500F';

            //$email = 'marco.cappellacci@uniurb.it';          
            //$cf = 'UNIURB';       
            // {
            //     "username": "marco.cappellacci",
            //     "fiscalCode": "UNIURB",
            //     "isAdmin": true,
            //     "canSign": true,
            //     "canCreateForOther": false,
            //     "canManageCertificates": false,
            //     "canUseTimestamp": false,
            //     "certificateName": "CPPMRC87H26L500A_UNIURB"
            //   },           
        }
        $cf_custom = $pre->user->getCodiceFiscaleUSign();
        if ($cf_custom){
            Log::info('Letto codice_fiscale_usign: '.$cf_custom.' per '.$pre->user->name);
            $cf = $cf_custom;
        }

        // Check if the user is authorized and has signing capabilities
        $response = $this->client->userAuthorization($cf);
        if (!$response->successful()) {
            return $this->createErrorResponse('Utente non abilitato al processo di firma su U-Sign. ' . $response->getReasonPhrase(), ['code' => 'userAuthorization']);
        }
        
        $data = $response->json();
        if (!$data['canSign']) {
            return $this->createErrorResponse('Utente non abilitato al processo di firma su U-Sign.', ['code' => 'canSign']);
        }
        
        $certificateName = $data['certificateName'] ?? null;
        if (!$certificateName) {
            return $this->createErrorResponse('Utente non ha un certificato di firma associato in U-Sign.', ['code' => 'certificateName']);
        }
        
        if (!App::environment(['local', 'preprod', 'testing'])) {
            // Retrieve user information and verify certificate details
            $response = $this->client->userInfo($email);
            if (!$response->successful()) {
                return $this->createErrorResponse('Utente non abilitato al processo di firma su U-Sign. ' . $response->getReasonPhrase(), ['code' => 'userInfo']);
            }
            
            $data = $response->json();
            $certificate = $data['certificate'] ?? null;
            if (!$certificate) {
                return $this->createErrorResponse('Utente non ha un certificato di firma associato in U-Sign.', ['code' => 'certificate']);
            }
            
            // Validate certificate details
            if ($certificateName !== $certificate['aliasCertificato']) {
                return $this->createErrorResponse('Utente ha nome certificato e alias certificato non corrispondenti nella configurazione U-Sign.', ['code' => 'certificateMismatch']);
            }
            
            if ($certificate['status'] === 'EXPIRED') {
                return $this->createErrorResponse('Utente ha un certificato di firma scaduto associato in U-Sign.', ['code' => 'certificateExpired']);
            }
            
            if ($certificate['status'] !== 'VALID') {
                return $this->createErrorResponse('Utente ha un certificato di firma non valido associato in U-Sign.', ['code' => 'certificateNotValid']);
            }
        }

        $response = $this->client->createProcess($email, $name, true);
        if (!$response->successful()){          
            return $this->createErrorResponse('Errore nella creazione della richiesta di firma. '.$response->getReasonPhrase());
        }
        // Decode the JSON response
        $data = $response->json(); //json_decode($response, true);                    
        $processId = $data['message'];
     
        $firma = new FirmaUSIGN([
            'tipo' => 'USIGN',
            'process_id' => $processId, //token
            'assignee_email' => $email,                     
            'document_type' => 'ALTRO',           
        ]);

        $pre->firmaUSIGN()->save($firma);
        $validazioni = $pre->validazioni;                    
        $validazioni->tipo_accettazione = 'USIGN';  
        $validazioni->save();

        $this->updateFirmaWithStep($processId, $firma);    
        //rileggo lo stato per eventuali errori
        $response = $this->updateFirmaWithStatus($processId, $firma);

        if (!$response['success']){
            return $response;
        }

        Log::info('Creato record di firma FirmaUSIGN '.$firma->id.' per la precontrattuale '.$pre->id);

        return $this->uploadAndFinish($firma->process_id,$pre, $firma);
        //return $this->createSuccessResponse('Richiesta di firma creata correttamente.', $response['data']);        
    }

    public function updateFirmaWithStatus($processId, $firma = null){
        if ($firma==null){
            $firma = FirmaUSIGN::where('process_id',$processId)->first();
        }
        //Restituisce lo stato del processo identificato dal token, che può assumere i seguenti valori: Upload, Confirm, Sent-to-user, Otp, Completed .

        //ritorno dello status
        //     "code": 200,
        //     "rejections": [],
        //     "message": "active",
        //     "status": "active",
        //     "token": "04395C728ECE08155A2883D4416C114E0C6C9E7648E6698AAD3E8AF9135DB73D"
        //   }
                
        $response = $this->client->processStatus($processId);
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nella lettura dello stato del processo.');
        }

        // Decode the JSON response
        $data = $response->json(); //json_decode($response, true);                            
        // Extract the rejection reasons from the "rejections" key
        $rejectionReasons = isset($data['rejections']) ? $data['rejections'] : [];
        // Convert the array of rejection reasons to a simple array containing only the reasons
        $allReasons = array_column($rejectionReasons, 'reason');

        $firma->stato = $data['status'];
        $firma->rejections = empty($allReasons) ? '' :implode(', ', $allReasons);        
        $firma->save();

        return $this->createSuccessResponse("Aggiornamento effettuato con successo", $firma);
    }

    public function updateFirmaWithStep($processId, $firma = null){
        if ($firma==null){
            $firma = FirmaUSIGN::where('process_id',$processId)->first();
        }
        
        $response = $this->client->processStep($processId);
        if (!$response->successful()){        
            return $this->createErrorResponse('Errore nella lettura dello step del processo.');
        }

        // Decode the JSON response
        $data = $response->json(); //json_decode($response, true);                                 
        $firma->step = $data['description'];      
        $firma->save();

        return $this->createSuccessResponse("Aggiornamento effettuato con successo", $firma);
    }

    public function uploadFinished($processId, $pre, $firma){
        $response = $this->client->uploadFinished($processId);
        if (!$response->successful()){                                 
            return $this->createErrorResponse('Errore nella chiusura upload. '.$response->getReasonPhrase());
        }
        
        $responseToClient = $this->getLink($processId, $firma);

        if ($responseToClient['success']){
            //processo di firma creato, file caricato
            $pre->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Creato processo di firma su U-Sign '.$firma->file_id, 
                $pre->insegn_id)
            );
        }

        return $responseToClient;
    }
    
    /**
     * uploadAndFinish 
     * 
     * caricamento del contratto
     *
     * @param  mixed $processId
     * @param  mixed $pre
     * @param  mixed $firma
     * @return void
     */
    public function uploadAndFinish($processId, $pre, $firma){
        //processId "68CC066C17F0DE992F5DFF89AA4D74D5946821127386756E8896498C1EA8BFBE"                      
        [$attrs, $pdf] = $this->posizioneFirma($pre);   

        //upload del file pdf
        $fileContent = $pdf->output();

        $response = $this->client->upload($processId,$fileContent,$attrs);                       
        if (!$response->successful()){
            return $this->createErrorResponse( 'Errore nel caricamento del contratto. '.$response->getReasonPhrase());              
        }

        $data = $response->json(); //json_decode($response, true);    
        $firma->update([
            'file_id' => $data['message']
        ]);                                         
        
        //chiudo il caricamento 
        sleep(4);
        $response = $this->retry('uploadFinished', [ $processId ]);        
        if (!$response->successful()){
            $firma->update([
                'rejections' => $response->getReasonPhrase()
            ]);             
            return $this->createErrorResponse('Errore chiusura documenti. '.$response->getReasonPhrase());              
        }                
        
        $this->updateFirmaWithStatus($firma->process_id,$firma);
        $this->updateFirmaWithStep($firma->process_id,$firma);   

        $responseToClient = $this->getLink($processId, $firma);

        if ($responseToClient['success']){
            //processo di firma creato, file caricato
            $pre->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Creato processo di firma su U-Sign '.$firma->file_id, 
                $pre->insegn_id)
            );
        }

        return $responseToClient;
       
    }

    private function getLink($processId, $firma)    
    {       
        //commento perchè è impostata la notifica automatica e al momento arrivano 2 email 
        // if(!$firma->notify_assigned_user){
        //     $response = $this->client->notifyAssignedUser($processId);                       
        //     if ($response->successful()){
        //         $firma->update([
        //             'notify_assigned_user' => true
        //         ]);               
        //     }
        // }

        $response = $this->client->link($processId);                       
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nel collegamento al processo di firma. '.$response->getReasonPhrase());              
        }
        
        $data = $response->json();  
        $firma->update([
            'link' => $data['description']
        ]);   
        
        return $this->createSuccessResponse('Richiesta di firma creata correttamente. Accedere in U-Sign per completare il processo di firma.', $firma);                                   
    }

    public function posizioneFirma($pre){        
        //genera contratto
        $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA'); 
        //calcolo posizione firma
        $attrs = PdfSignService::getSignPosition($pdf)[0];        
        
        return [$attrs, $pdf];
    }

    public function documentoFirmato($insegn_id, $process_id, $file_id){

        $response = $this->client->downloadSingleFile($process_id, $file_id);
        if (!$response->successful()){
            return $this->createErrorResponse( 'Documento firmato non reperibile. '.$response->getReasonPhrase());              
        }

        $pdfOutput = $response->json()['message'];
        if (!$pdfOutput){
            return $this->createErrorResponse( 'Documento firmato non reperibile. ');              
        }

        $pdfOutput = base64_decode($pdfOutput);
        $repo = new PrecontrattualeRepository(app());
        $service = new PrecontrattualeService($repo);
     
        //se ho il documento vado avanti nel processo della precontrattuale
        $result = $service->presaVisioneAccettazioneFirmaUSIGN($insegn_id, $pdfOutput);
        
        return $this->createSuccessResponse('Contratto firmato.', $result);
    }

    public function cancellazioneIstanza($id, $pre){        
        $firma = FirmaUSIGN::where('id',$id)->first();
        if ($firma->precontr_id != $pre->id){
            return $this->createErrorResponse( 'Dati incoerenti per la firma');     
        }

        $response = $this->client->delete($firma->process_id);
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nella cancellazione istanza di firma. '.$response->getReasonPhrase());              
        }

        //aggiornare lo stato e lo step di firma 
        $firma->stato = 'cancelled';
        $firma->step = 'cancelled';      
        $firma->save();
        
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Cancellata richiesta di firma su U-Sign', 
            $pre->insegn_id)
        );

        $validazioni = $pre->validazioni;                    
        $validazioni->tipo_accettazione = null;  
        $validazioni->save();

        return $this->createSuccessResponse('Cancellato processo di firma.', $response);
    }

    // Funzione per creare una risposta di errore
    private function createErrorResponse($message, $data = [])
    {
        return [
            'success' => false,
            'message' => $message,
            'data' => $data,
        ];
    }

    // Funzione per creare una risposta di successo
    private function createSuccessResponse($message, $data)
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];
    }

    public function firmaUSIGNAggiornato($process_id){
        $firma = FirmaUSIGN::where('process_id',$process_id)->orderby('created_at', 'desc')->first();
        return $firma;
    }
}