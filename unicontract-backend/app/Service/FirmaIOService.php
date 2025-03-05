<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Models\FirmaIO;
use DB;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\FirmaIOClient;
use App\Repositories\PrecontrattualeRepository;
use App\Service\PrecontrattualeService;

class FirmaIOService implements CancellazioneServiceInterface
{
    public FirmaIOClient $client;
    public function __construct()
    {
        $this->client = new FirmaIOClient();
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

    public function richiestaFirmaIO($pre, $firma = null){        
        //valuta esistenza di una richiesta e eventuale aggiornamento            
        if ($firma == null){
            $firma = $pre->latestFirmaIOnotRejected();            
        }        
        //$firma = $pre->firmaIO()->where('stato','!=','REJECTED')->orderby('created_at', 'desc')->first();            
        if ($firma){  
            //se esiste una richiesta di firma 
            $result = $this->getUpdateSignatureRequest($firma->signature_request_id);

            if (!$result['success']){        
                return $result;
            }

            $firma = $result['data'];        
               
            // Valuta gli step successivi in base allo stato
            switch ($firma->stato) {
                case 'DRAFT':
                    return $this->handleDraftState($pre, $firma);                                                   
                case 'READY':
                    // La richiesta di firma è pronta per essere inviata al cittadino
                    return $this->createSuccessResponse('Richiesta di firma creata correttamente. Accedere all\'App IO.', $firma);
                 
                case 'WAIT_FOR_SIGNATURE':
                    // La richiesta di firma è stata inviata al cittadino e si sta attendendo la firma
                    return $this->createSuccessResponse('Documento in attesa di firma sull\'App IO. Attendere la notifia o accedere all\'App IO.', $firma);

                case 'WAIT_FOR_QTSP':
                    return $this->createSuccessResponse('Processo di firma correttamente completato, in attesa di elaborazione.', $firma);

                case 'SIGNED':
                    // Tutti i documenti sono stati firmati
                    // nei dati di firma è presente l'url di scaricare il documento 

                    //scaricare il documento
                    //chiamare funzione presavisione                      
                    //passarlo a Titulus 
                    $downloadUrl = $firma->contenuto->documents[0]->url;
                    return $this->documentoFirmato($pre->insegn_id, $downloadUrl);

                case 'REJECTED':
                    // La richiesta di firma è stata rifiutata
                    //Nel caso in cui la signature_request risulti REJECTED, troverai la motivazione.all'interno del campo rejected_reason .
                    return $this->createErrorResponse('Non è stato possibile procedere con la firma dei documenti: '.$firma->rejected_reason);

                case 'CANCELLED':
                    return $this->createSuccessResponse('Richiesta di firma cancellata.', $firma);

                case 'EXPIRED':
                     
                    $pre->storyprocess()->save(
                        PrecontrattualeService::createStoryProcess('Scaduta richiesta di firma su FirmaIO', $pre->insegn_id, $pre->user)
                    );

                    return $this->createSuccessResponse('Processo di firma scaduto.', $firma);  
            }
        }else{
            return $this->creareFirmaIO($pre);
        }            
    }

    public function documentoFirmato($insegn_id, $downloadUrl){

        $response = $this->client->download($downloadUrl);
        if (!$response->successful()){
            return $this->createErrorResponse( 'Documento firmato non reperibile. '.$response->getReasonPhrase());              
        }

        $pdfOutput = $response->body();
        if (!$pdfOutput){
            return $this->createErrorResponse( 'Documento firmato non reperibile. ');              
        }

        $repo = new PrecontrattualeRepository(app());
        $service = new PrecontrattualeService($repo);
     
        //se ho il documento vado avanti nel processo della precontrattuale
        $result = $service->presaVisioneAccettazioneFirmaIO($insegn_id, $pdfOutput);
        //ritorna la precontrattuale tra i dati
        return $this->createSuccessResponse('Contratto firmato.', $result);
    }


    public function getUpdateSignatureRequest($signature_request_id)
    {                 
        $firma = $this->richiestaFirmaAggiornata($signature_request_id);                
        if ($firma){
            //se esiste una richiesta di firma attiva allora vedo in che stato si trova e aggiorno
            $response = $this->client->getSignatureRequest($firma->signature_request_id);
            if (!$response->successful()){
                return $this->createErrorResponse('Richiesta inserita non reperibile. '.$response->getReasonPhrase());              
            }

            $data = $response->json(); //json_decode($response, true);                 
            
            // Extract the expiration date and convert it to the Rome timezone
            $expiresAt = Carbon::parse($data['expires_at'])->setTimezone('Europe/Rome');
            // Get the current date and time in the Rome timezone
            $now = Carbon::now('Europe/Rome');
            // Compare expiration date with the current date and time
            if ($now->gt($expiresAt)) {
                $data['status'] = 'EXPIRED';
            }

            //Aggiorno la richiesta e valuto gli step successivi            
            $firma->update([
                'tipo' => 'FIRMAIO',               
                'signature_request_id' => $data['id'],
                'document_id' =>  $data['documents'][0]['id'], //id del primo documento
                'contenuto' => $response->getBody(),
                'stato' => $data['status'], //stato della richiesta
                'rejected_reason' => ($data['status'] =='REJECTED' ? $data['reject_reason'] : null),
            ]);         
        }

        $data = $firma;        
        //ritorna l'entità di firma
        return $this->createSuccessResponse('Stato della richiesta di firma aggiornato correttamente.', $data);
    }

    //esegue gli step 2, 3, 4 e 5 e ritorno
    public function creareFirmaIO($pre){

        $cf = $pre->user->cf;
        if (App::environment(['local','preprod'])) { 
            //TODO test con cf non trovato   
            $cf = "LVONRC76C29L500F";            
            //$cf = 'CPPMRC87H26L500A'; 
            //$cf = "TMSMHL76L23D542J";
        }
        $response = $this->client->getSigner($cf);
       
        if (!$response->successful()){
            return $this->createErrorResponse('Prima di procedere con la firma, è necessario installare l\'app IO sul proprio dispositivo mobile (https://io.italia.it) ed effettuare il primo accesso. Per accedere all\'app IO, è richiesto lo SPID.'); // ('.$response->getReasonPhrase().')');
        }
        //leggi il signer_id del cittadino
        $signer_id = $response->object()->id;  

        [$attrs, $pdf] = $this->posizioneFirmaIO($pre);   
        if (!$attrs){
            return $this->createErrorResponse('Errore nel documento pdf. Contattare assistenza.');
        }

        $dossier_id = config('firmaio.dossier_id');
        $response = $this->client->createSignatureRequest($signer_id, $attrs, $dossier_id);
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nella creazione della richiesta di firma sull\'App IO.');
        }
        // Decode the JSON response
        $data = $response->json(); //json_decode($response, true);     
               
        $signatureRequestId = $data['id'];
        $documentId = $data['documents'][0]['id'];
      
        //DRAFT - la richiesta di firma è stata creata, ma non è ancora stata finalizzata. In questo caso, 
        //è necessario caricare i documenti o marcarla esplicitamente come READY;
        $firma = new FirmaIO([
            'tipo' => 'FIRMAIO',
            'dossier_id' => $dossier_id,
            'signer_id' => $signer_id,           
            'signature_request_id' => $signatureRequestId,
            'document_id' =>  $documentId, //id del primo documento
            'contenuto' => $response->getBody(),
            'stato' => $data['status'], //stato della richiesta
            'rejected_reason' => ($data['status'] =='REJECTED' ? $data['reject_reason'] : null),
        ]);
        $pre->FirmaIO()->save($firma);
        $validazioni = $pre->validazioni;    
        $validazioni->tipo_accettazione = 'FIRMAIO';  
        $validazioni->save();
        
        return $this->uploadDocumentiPubblicazioneRichiestaAggiornamento($signatureRequestId, $documentId, $pdf, $firma, $pre);
    }

    //esegue gli step 4 e 5 e ritorno
    private function uploadDocumentiPubblicazioneRichiestaAggiornamento($signatureRequestId, $documentId, $pdf, $firma, $pre)
    {
         //richieta url di upload 
         $response = $this->client->uploadURL($signatureRequestId, $documentId);
         if (!$response->successful()){
             return $this->createErrorResponse('Errore url di upload del contratto.');
         }
         //$uploadUrl = $response->body();
         $uploadUrl = $response->json();
        
         //caricamento del file pdf
         $fileContent = $pdf->output();
         $response = $this->client->upload($uploadUrl, $fileContent);
         if (!$response->successful()){
             return $this->createErrorResponse('Errore upload del contratto.');
         }
         $firma->update([
             'documenti_caricati'=>true,
         ]);
        
        return $this->pubblicazioneRichiestaAggiornamento($signatureRequestId, $pre);
    }

    public function sendNotification($signatureRequestId){
        //inviare la notifica ...
        sleep(2);
        $response = $this->retry('sendNotification', [ $signatureRequestId ]);
        //aggiornare il message id della notifica 
        $data = $response->json();
        if ($response->successful()){
            $firma = $this->richiestaFirmaAggiornata($signatureRequestId); 
            Log::info('Inviata notifica a a FirmaIO signature id '.$signatureRequestId.'  io_message_id '.$data['io_message_id']);
            $firma->update([
                'io_message_id'=> $data['io_message_id'],
            ]);                          
        }
        return $response;
    }

    //Esegue Step 5: Invia la richiesta di firma e ritorno
    private function pubblicazioneRichiestaAggiornamento($signatureRequestId, $pre)
    {
        //Step 5: Invia la richiesta di firma 
        //la pubblicazione della richiesta imposta lo stato a READY (put)
        
        // "title": "Bad Request",
        // "status": 400,
        // "detail": "MARK_AS_READY is not possible unless all documents are READY"

        sleep(2);
        $response = $this->retry('pubblicazioneRichiesta', [ $signatureRequestId ]);
        //$response = $this->client->pubblicazioneRichiesta($signatureRequestId);
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nella pubblicazione della richiesta.');        
        }            

        //processo di firma creato, file caricato
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Creata richiesta di firma su FirmaIO', 
            $pre->insegn_id)
        );

        //aggiorna la firma e salva id del messaggio
        $this->sendNotification($signatureRequestId);

        //legge da API e aggiorna FirmaIO nel database
        $this->getUpdateSignatureRequest($signatureRequestId);
        
        //legge dal database
        $data = $this->richiestaFirmaAggiornata($signatureRequestId);
        //lo stato corretto di uscita da questa funzione è READY o WAIT_FOR_SIGNATURE
        //puo finire anche con REJECTED ...
         // Valuta gli step successivi in base allo stato
         switch ($data->stato) {                                                
            case 'READY':
                // La richiesta di firma è pronta per essere inviata al cittadino
                return $this->createSuccessResponse('Richiesta di firma creata correttamente. Accedere all\'App IO.', $data);
             
            case 'WAIT_FOR_SIGNATURE':
                // La richiesta di firma è stata inviata al cittadino e si sta attendendo la firma
                return $this->createSuccessResponse('Richiesta di firma creata correttamente. Accedere all\'App IO.', $data);

            case 'SIGNED':
                // Tutti i documenti sono stati firmati
                return $this->createSuccessResponse('Contratto risulta firmato.', []);
                //TODO scaricare il documento e ... aggiornare la precontrattuale ... 
            case 'REJECTED':
                // La richiesta di firma è stata rifiutata
                return $this->createErrorResponse('Richiesta di firma rigettata. '.$data->rejected_reason);
               
        }

        return $this->createSuccessResponse('Richiesta di firma creata correttamente. Stato '.$data->stato, $data);
    }

    public function posizioneFirmaIO($pre){        

        $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA'); 
        //calcolo posizione firma
        $attrs = PdfSignService::getSignPosition($pdf)[0];        
        
        return [$attrs, $pdf];
    }

    
    public function validateDocument($pre){     
          
          [$attrs, $pdf] = $this->posizioneFirmaIO($pre);   
        
          //try {
                $response = $this->client->validateDocument($pdf->output(),$attrs);
                // Check if the request was successful
                if ($response->getStatusCode() === 200) {
                    // Get the response data
                    $responseData = json_decode($response->getBody(), true);
                    // Process the response data as needed
                    if ($responseData['is_valid']){
                        return $this->createSuccessResponse('Documento validato', $responseData);                 
                    }else {
                        return $this->createErrorResponse(is_array($responseData['violations']) ? implode(' ',$responseData['violations']) : $responseData['violations']);
                    }
                    
                } else {
                    // Request failed, handle the error
                    $statusCode = $response->getStatusCode();
                    $errorMessage = $response->getBody();
                    // Handle the error as needed
                    // ...
                    return $this->createErrorResponse($errorMessage);
                }
            // } catch (\Exception $e) {
            //     // Handle any exceptions that may occur during the request
            //     // ...
            //     return $this->createErrorResponse( $e->getMessage()); 
            //     //response()->json(['error' => $e->getMessage()], 500);
            // }
    }


    private function handleDraftState($pre, $firma)
    {
        if ($firma->documenti_caricati){      
            return $this->pubblicazioneRichiestaAggiornamento($firma->signature_request_id, $pre);
        }else{
            //caricare i documenti 
            [$attrs, $pdf] = $this->posizioneFirmaIO($pre);   
            return $this->uploadDocumentiPubblicazioneRichiestaAggiornamento($firma->signature_request_id, $firma->document_id, $pdf, $firma, $pre);
        }      
    }    

    public function cancellazioneIstanza($id, $pre){ 
        $firma = FirmaIO::where('id',$id)->first();
        if ($firma->precontr_id != $pre->id){
            return $this->createErrorResponse('Dati incoerenti per la firma');     
        }

        $response = $this->client->cancellazioneRichiesta($firma->signature_request_id);
        if (!$response->successful()){
            return $this->createErrorResponse('Errore nella cancellazione istanza di firma. '.$response->getReasonPhrase());              
        }
        
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Cancellata richiesta di firma su FirmaIO', 
            $pre->insegn_id)
        );

        $validazioni = $pre->validazioni;                    
        $validazioni->tipo_accettazione = null;  
        $validazioni->save();
        //aggiorno
        return $this->richiestaFirmaIO($pre, $firma);
    }

    // Funzione per creare una risposta di errore
    private function createErrorResponse($message)
    {
        return [
            'success' => false,
            'message' => $message,
            'data' => [],
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

    public function richiestaFirmaAggiornata($signature_request_id){
        $firma = FirmaIO::where('signature_request_id',$signature_request_id)->orderby('created_at', 'desc')->first();
        return $firma;
    }
}