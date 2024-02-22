<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Insegnamenti;
use App\InsegnamUgov;
use App\User;
use App\Precontrattuale;
use App\PrecontrattualePerGenerazione;
use App\SendEmail;
use App\Mail\FirstEmail;
use Illuminate\Support\Facades\Mail;
use DB;
use PDF;
use PDFM;
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Request\SaveParams;
use App\Soap\Request\AttachmentBean;
use App\Models\Titulus\Fascicolo;
use App\Models\Titulus\Documento;
use App\Models\Titulus\Rif;
use App\Models\Titulus\Element;
use App\Models\Validazioni;
use App\Models\FirmaIO;
use Illuminate\Support\Facades\Log;
use App\MappingUfficio;
use Carbon\Carbon;
use App\Repositories\PrecontrattualeRepository;
use View;
use App\Models\StoryProcess;
use App\Http\Controllers\SoapControllerWSACPersonaFisica;
use App\Soap\Request\WsdtoPersonaFisicaSearch;
use App\Soap\Request\WsdtoPagamento;
use PHP_IBAN\IBAN;
use Exception;
use App\Http\Controllers\FirmaIOClient;


class PrecontrattualeService implements ApplicationService
{

 /**
     * @var PrecontrattualeRepository
     */
    private $repo;
    public function __construct(PrecontrattualeRepository $repo){
        $this->repo = $repo;
    }


    public static function createStoryProcess($description, $insegn_id, $user = null){
        $sp = new StoryProcess();
        $sp->insegn_id = $insegn_id;
        $sp->descrizione = $description;
        if (Auth::user()){
            $sp->user_id = Auth::user()->id;
        } else {
            $sp->user_id = $user->id;
        }
        return $sp;
    }

    public static function addToStoryProcess($description, $insegn_id)
    {
        $sp = createStoryProcess($description,$insegn_id);
        $result = $sp->save();        
        return $result;
    }

    public static function getDatiIntestazione($insegn_id){
        
        $queryBuilder = Precontrattuale::withoutGlobalScopes()->leftJoin('users', function($join) {
            $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
        })
        ->leftJoin('p1_insegnamento', function($join) {
            $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
        })
        ->leftJoin('a1_anagrafica', function($join) {
            $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
        })
        ->where('precontr.insegn_id', $insegn_id);

        $datiPrecontrattuale = $queryBuilder->first(
            ['users.id AS userid',
             'users.nome',
             'users.cognome',
             'precontr.*',
             'p1_insegnamento.insegnamento',
             'p1_insegnamento.aa',
             'a1_anagrafica.sesso'
             ]);

        return $datiPrecontrattuale;
    }

    public static function configPdf($title, $preview = false){
        return [
            'title' => $title,
            'author' => 'UniContr',
            'format' => 'A4',
            'margin_left' => 20,
            'margin_right' => 20,
            'margin_top' => 20,
            'margin_bottom' => 30,     
            'orientation' => 'P',    
            'watermark' => 'ANTEPRIMA',            
            'show_watermark' => $preview ? true : false,
            'pdfa' => $preview ? false : true,
            'showImageErrors'=> true,            
            'custom_font_dir' => public_path('font/'),
            'custom_font_data' => [
               'timesnewroman' => [
                   'R' => 'Times_New_Roman.ttf',
                   'B' => 'Times_New_Roman_Bold.ttf',
                   'I' => 'Times_New_Roman_Italic.ttf',
               ]
            ],  
            'default_font' => 'timesnewroman',   
            'temp_dir' => storage_path('tempdir')         
        ];
        //'watermark'                => 'ANTEPRIMA',
        //'show_watermark'           => true,
    }        

    public static function makePdfForContratto($pre, $type){

        $config = PrecontrattualeService::configPdf('Contratto', $type == 'CONTR_BOZZA');
        $config['margin-top'] = '30';
        $config['margin-right'] = '20';                             
        $config['margin-left'] = '20';                             
        $config['margin-bottom'] = '30';   
        
        if (App::environment(['local','preprod']) && $type !== 'CONTR_BOZZA') {
            $config['watermark'] = 'TEST TEST';
            $config['show_watermark'] = true;
            $config['pdfa'] = false;
        }

        $pdf = PDFM::loadView(
            'contratto', 
            ['pre' => $pre, 'type'=>$type],
            [], 
            $config);                 

        return $pdf;

        // $pdf = PDF::loadView('contratto', ['pre' => $pre, 'type'=>$type]);        
        // if (App::environment(['local'])) {
        //     //con il javasctipt - something whent wrong in locale WINDOWS
        //     $header = View::make('contratto.headerlocal');      
        //     $pdf->setOption('header-html', $header);
        // }else{            
        //     $header = View::make('contratto.header');      
        //     $pdf->setOption('header-html', $header);                      
        // }
        // $pdf->setOption('enable-local-file-access',true);
        // $pdf->setOption('load-error-handling','ignore');
        // $pdf->setOption('margin-top','44');           
        // $pdf->setOption('margin-right','30');                             
        // $pdf->setOption('margin-bottom','25');              
        // $pdf->setPaper('a4');

        // return $pdf;
    }


    public static function previewContratto($insegn_id){
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','validazioni'])->where('insegn_id',$insegn_id)->first();       
        if ($pre->isBozza()){
            return PrecontrattualeService::createContratto($pre,'CONTR_BOZZA');
        }else{
            return PrecontrattualeService::createContratto($pre,'CONTR_FIRMA');
        } 
    }

    public static function createContratto($pre, $type){
        
        $attach = null;
        $pdf = PrecontrattualeService::makePdfForContratto($pre, $type);
      
        $attach['attachmenttype_codice'] =  $type;
        $attach['filename'] = 'Contratto'. $pre->user->nameTutorString() .'.pdf';
        try {
            $value = $pdf->output();
            $attach['filevalue'] =  base64_encode( $value);
        } catch (\Throwable $th) {
            throw $th;
        }        
        
        return $attach;
    }    

    public static function createContrattoBozza($insegn_id){

        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();       

        $attach = null;
        $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_BOZZA');
      
        $attach['attachmenttype_codice'] = 'CONTR_BOZZA';
        $attach['filename'] = 'Contratto'. $pre->user->nameTutorString() .'.pdf';
        try {
            $value = $pdf->output();
            $attach['filevalue'] =  base64_encode( $value);
        } catch (\Throwable $th) {
            throw $th;
        }        
        
        return $attach;
    }    

    public function presaVisioneAccettazione($insegn_id){

        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();  
        //salva documento in Titulus in stato di bozza
        $data = PrecontrattualeService::saveContrattoBozzaTitulus($pre);
        $data['tipo_accettazione'] = 'PRESA_VISIONE';
        //aggiorna titulus ref e attachment
        $result = $this->repo->newPresavisioneAccettazione($data, $pre);
        // email segreteria del rettore catia rossi
        EmailService::sendEmailByType($insegn_id,'APP_FIRMA');

        return $result;
    }

    public function presaVisioneAccettazioneFirmaIO($insegn_id, $pdfOutput){

        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();  
        //salva documento in Titulus in stato di bozza
        $data = PrecontrattualeService::saveContrattoBozzaTitulus($pre, $pdfOutput);
        $data['tipo_accettazione'] = 'FIRMAIO';
        //aggiorna titulus ref e attachment
        $result = $this->repo->newPresavisioneAccettazione($data, $pre, 'Firmato con FirmaIO');
        // email segreteria del rettore catia rossi
        EmailService::sendEmailByType($insegn_id,'APP_FIRMA');

        return $result;
    }

    public function presaVisioneAccettazioneFirmaUSIGN($insegn_id, $pdfOutput){

        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();  
        //salva documento in Titulus in stato di bozza
        $data = PrecontrattualeService::saveContrattoBozzaTitulus($pre, $pdfOutput);
        $data['tipo_accettazione'] = 'USIGN';
        //aggiorna titulus ref e attachment
        $result = $this->repo->newPresavisioneAccettazione($data, $pre, 'Firmato con U-Sign');
        // email segreteria del rettore catia rossi
        EmailService::sendEmailByType($insegn_id,'APP_FIRMA');

        return $result;
    }


    public function richiestaFirmaIO($insegn_id){
        $data = [];
        $message = 'Inoltrato documento per la firma sull\'App IO';
        $success = true;

        $service = new FirmaIOService();        
        
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();         

        return $service->richiestaFirmaIO($pre);                
    }

    public function richiestaFirmaUSIGN($insegn_id){
        $data = [];
        $message = 'Inoltrato documento per la firma con U-SIGN';
        $success = true;

        $service = new FirmaUSIGNService();        
        
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();         

        return $service->richiestaFirmaUSIGN($pre);                
    }


    public function cancellazioneIstanzaFirmaUtente($insegn_id, $entity){
        $data = [];
        $message = 'Cancellata istanza di firma';
        $success = true;

        $service = null;
        if ($entity['nomeProvider'] == 'FIRMAIO'){
            $service = new FirmaIOService();    
        }
        if ($entity['nomeProvider'] == 'USIGN'){
            $service = new FirmaUSIGNService();    
        }
                   
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('insegn_id',$insegn_id)->first();         

        return $service->cancellazioneIstanza($entity['id'], $pre);                
    }

    public static function saveContrattoBozzaTitulus($pre, $pdfOutput = null) {
            
        $sc = new SoapControllerTitulus(new SoapWrapper);

        $filevalue = $pdfOutput;
        if ($pdfOutput == null){
            $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA'); 
            $filevalue = $pdf->output();
        }
        
        $attachment = null;
        $attachment['filename'] = 'Contratto'. $pre->user->nameTutorString() .'.pdf';        
        
        $attachBeans = array();        
        if ($filevalue !=null){
            $attachmentTmp = new AttachmentBean();
            $attachmentTmp->setFileName($attachment['filename']);                
            $attachmentTmp->setDescription("Contratto di insegnamento");
            $attachmentTmp->setMimeType("application/pdf");
            $attachmentTmp->setContent($filevalue);      
            array_push($attachBeans,  $attachmentTmp);            
        }

        $newDoc = PrecontrattualeService::getDocumentoBozzaTitulus($pre);
        Log::info('Chiamata saveDocument [' . $newDoc . ']');   

        $sd = new SaveDocument($newDoc, $attachBeans, new SaveParams(false,false));            
        $response = $sc->saveDocument($sd);
        Log::info('Risposta saveDocument [' . $response . ']');           
        //leggere risposta prendere i valori di num_prot nrecord e data_prot
        $obj = simplexml_load_string($response);
        $doc = $obj->Document->doc;

        $attachment['physdoc'] = (string) $doc['physdoc'];
        $attachment['nrecord'] = (string) $doc['nrecord'];
        $attachment['attachmenttype_codice'] = 'CONTR_FIRMA';

        $attachment['signed'] = (boolean)$doc->files->children('xw', true)[0]->attributes()['signed'];
        $attachment['bozza']  = (string)$doc['bozza'];
        //in bozza non c'è il protocollo
        //$attachment['num_prot'] = (string) $doc['num_prot'];
        $attachment['emission_date'] =  Carbon::createFromFormat('Ymd', ((string) $doc['data_prot']))->format(config('unidem.date_format')); //aaaammgg
        Log::info('physdoc [' . $attachment['physdoc'] . ']');                   
        $attachment['filevalue'] =  base64_encode($filevalue);
        return $attachment;
    }

    public static function getDocumentoBozzaTitulus($pre){
       
        $doc = new Documento;
        $doc->rootElementAttributes->tipo = 'partenza';
        $doc->rootElementAttributes->bozza = 'si';

        $doc->addRepertorio('CONTdoc','Contratti docenza');            
        
        //TODO epigrafe insegnamento
        $doc->oggetto = 'Contratto di insegnamento '.$pre->insegnamento->insegnamento; //almeno 30 caratteri                      
        $doc->addClassifCod('07/16');
        $doc->addAllegato('0 - nessun allegato');
        $doc->addVoceIndice('Contratti docenza');

        $unitaorganizzativa_uo = $pre->insegnamento->dip_cod;
      
        TitulusHelper::addRPA_Titulus($doc,$unitaorganizzativa_uo);        
        $doc->addCC("Ufficio Amministrazione e Reclutamento Personale Docente", "Antonelli Gianluca"); 
        $doc->addCC("Segreteria del Direttore Generale", "Rossi Catia"); 
        $mapping = MappingUfficio::where('unitaorganizzativa_uo', $unitaorganizzativa_uo)->first();
        $doc->addCC($mapping->descrizione_uff, "tutti"); 

        $doc->addRifEst($pre->user->name);
        // <postit cod_operatore="" operatore="UniContract" data="'.date( 'Ymd' ).'" ora="'.date( 'H:i:s' ).'">CONTRATTO DI INSEGNAMENTO SOTTOSCRITTO CON FIRMA ELETTRONICA DA '.$firstname.' '.$lastname.' 
        //IN DATA '.$dataSottoscrizione.' - '.$insegnamento.' - A.A. '.$aa.' DAL GIORNO '.date_format(date_create($dalGiorno), 'd/m/Y').' 
        //AL GIORNO '.date_format(date_create($alGiorno), 'd/m/Y').'</postit>

        $extra = new \SimpleXMLElement('<extra></extra>');
        $dati_conservazione = TitulusExtraDoc::addDati_conservazione($extra,[
            'tipologia' => 'registro_docente',
            'versione' => 1
        ]);

        $registro = TitulusExtraDoc::addRegistro($dati_conservazione,[
            'tipo' => 'Registro docente',
            'anno_accademico' => $pre->aa,
            'periodo_didattico' => $pre->ciclo,
            'vigenza_contrattuale_dal' => $pre->insegnamento->dataInizioPeriodo(),
            'vigenza_contrattuale_al' => $pre->insegnamento->dataFinePeriodo(),
        ]);

        TitulusExtraDoc::addIstituzione($registro, [
            'cod' => '70019',
            'denominazione' => 'Università degli Studi di Urbino Carlo Bo',
            'dipartimento' => $pre->dipartimento,
            'dipartimento_cod' =>  $pre->insegnamento->dip_cod
        ]);      

        $informazioni_di_corredo = $registro->addchild('informazioni_di_corredo');
       
        $matricola = '';
        TitulusExtraDoc::addEvento($informazioni_di_corredo,[
            'denominazione' => 'Sottoscrizione con firma elettronica',
            'data' => $pre->validazioni->date_accept,
            'agente_tipo' =>'persona',
            'agente_denominazione' =>$pre->user->nameTutorString(),
            'agente_matricola' => $matricola,
        ]);     
      
        TitulusExtraDoc::addPersona($extra,[
            'codice_fiscale' => $pre->user->cf,
            'cognome' =>$pre->user->cognome,
            'nome' => $pre->user->nome,
            'data_nascita' => $pre->anagrafica->provincia_nascita,
            'luogo_nascita' => $pre->anagrafica->comune_nascita,
            'sesso' =>  $pre->anagrafica->sesso,
            'nazione_nascita' => $pre->anagrafica->nazione_nascita,
            'cod_ANS' => $pre->anagrafica->nazione_nascita,
            'email' => $pre->user->email
        ]);

        TitulusExtraDoc::addSistemaMittente($extra,[
            'precontr_id' => $pre->id,
            'user_id' => $pre->user->id,
            'applicativo' => 'UniContr'
        ]);
       
        $newDoc = new \SimpleXMLElement($doc->toXml());    
        TitulusExtraDoc::xml_append($newDoc, $extra);

        return $newDoc->asXML();
    }

    public static function makePdfFromPresForReport($dip, $pres){

        $grouped = $pres->sortBy('insegnamento.data_delibera')->groupBy('aaNum');        
        $grouped = $grouped->sortKeysDesc();

        $config = PrecontrattualeService::configPdf('ELENCO CONTRATTI DI DOCENZA NON ANCORA STIPULATI');
        $config['margin-top'] = '10';
        $config['margin-right'] = '10';                             
        $config['margin-left'] = '10';                             
        $config['margin-bottom'] = '10';        
        $config['orientation'] = 'L';   
        $config['format'] = 'A3'; // Landscape  

        $pdf = PDFM::loadView(
            'reports.lista_precontrattuali',
            ['grouped' => $grouped, 'dip' => $dip],
            [],             
            $config);         
                      
        return $pdf;


        // $pdf = PDF::loadView('reports.lista_precontrattuali', ['grouped' => $grouped, 'dip' => $dip]);                
        // //$pdf->setOption('load-error-handling','ignore');
        // $pdf->setOption('margin-top','10');           
        // $pdf->setOption('margin-right','10');                             
        // $pdf->setOption('margin-left','10');                             
        // $pdf->setOption('margin-bottom','10');              
        // $pdf->setPaper('a3','landscape'); 

        // return $pdf;
    }

    //report da speidre alle segreterie
    public static function makePdfForReport($dip){

        $pres = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','validazioni'])
                    ->whereHas('insegnamento', function ($query) use($dip) {
                        $query->where('dipartimento','like','%'.$dip.'%');
                    })->where('stato','=',0)->get();                    

        $pdf = PrecontrattualeService::makePdfFromPresForReport($dip, $pres);        
        return $pdf;
    }

    


    public static function createModulisticaPrecontr($insegn_id){     
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','a2modalitapagamento','validazioni'])->where('insegn_id',$insegn_id)->first();       

        $attach = null;
        $pdf = PrecontrattualeService::makePdfPrecontrattualeReport($pre);
      
        $attach['attachmenttype_codice'] = 'MODULISTICA_PRECONTRATTUALE';
        $attach['filename'] = 'Modulistica_'. $pre->user->nameTutorString() .'.pdf';
        try {
            $value = $pdf->output();
            $attach['filevalue'] =  base64_encode( $value);
        } catch (\Throwable $th) {
            throw $th;
        }        
        
        return $attach;
    }    

    public static function makePdfPrecontrattualeReport($pre){               

        $config = PrecontrattualeService::configPdf('CONTRATTO DI INSEGNAMENTO');
        $config['margin-top'] = '20';
        $config['margin-right'] = '20';                             
        $config['margin-left'] = '20';                             
        $config['margin-bottom'] = '20';        

        $pdf = PDFM::loadView(
            'reports.reportcontratto',
            ['pre' => $pre],
            [],             
            $config);         
                      
        return $pdf;

        // $pdf = PDF::loadView('reports.reportcontratto', ['pre' => $pre]);                
        // //$pdf->setOption('load-error-handling','ignore');
        // $pdf->setOption('margin-top','20');           
        // $pdf->setOption('margin-right','20');                             
        // $pdf->setOption('margin-left','20');                             
        // $pdf->setOption('margin-bottom','20');              
        // $pdf->setPaper('a4'); //,

        // return $pdf;
    }

    public static function validazioneEconomica($insegn_id, $postData, &$msg){
        DB::beginTransaction(); 
        try {

            //salvataggio validazione
            $valid = Validazioni::where('insegn_id',$insegn_id)->first();

            $valid->fill($postData['entity']);
            $valid->date_amm = Carbon::now()->format(config('unidem.datetime_format'));

            if ($valid->current_place = "revisione_amministrativaeconomica_economica"){
                $transition = "valida_revisione_amministrativaeconomica_economica";
            } else if ($valid->current_place = "revisione_economica"){
                $transition = "valida_revisione_economica";
            }else {
                $transition = "valida_economica";
            }

            $valid->workflow_apply($transition); 

            $valid->save();    
            
            //aggiornamento modalità di pagamento verso ugov
            $pre = Precontrattuale::with(['user','a2modalitapagamento'])->where('insegn_id',$insegn_id)->first();       
            if ($pre->a2modalitapagamento->modality == 'ACIC'){
                $result = PrecontrattualeService::inserimentoIbanUgov(
                    $pre->a2modalitapagamento->iban, 
                    $pre->user->v_ie_ru_personale_id_ab,
                    $pre->user->cf,
                    $pre->a2modalitapagamento->intestazione
                );
                if ($result){
                    $msg = $msg.'Inserito Iban in Ugov';
                    $pre->storyprocess()->save(
                        PrecontrattualeService::createStoryProcess('Validazione economica: Inserito Iban in Ugov '.$pre->a2modalitapagamento->iban,  
                        $pre->insegn_id)
                    );
                } 
            } 

            $data = EmailService::sendEmailByType($insegn_id,"APP");  

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();

        $data = Validazioni::where('insegn_id',$insegn_id)->first();
        return $data;
    }

    public static function esisteIbanUgov($myiban, $id_ab, $cf){

        return true;

        $iban = new IBAN($myiban);
        $mf_iban = $iban->MachineFormat();

        $sc = new SoapControllerWSACPersonaFisica(new SoapWrapper);   
        $wsdtoPersonaFisicaSearch = WsdtoPersonaFisicaSearch::fromBasicData(null, null, null, $id_ab, $cf);             
        $response = $sc->elencaCoordPagamento($wsdtoPersonaFisicaSearch, null);
        
        $obj = $response;

        if (!isset($obj->listaCoordPagamento)){
            //se non è settata listaCoordPagamento
            return false;
        }

        $hasMyIBAN = array_filter($obj->listaCoordPagamento, function ($coordPagamento) use($mf_iban) {
            //trovato e valido altrimenti aggiungo 
            $isBeetwen = Carbon::now()->between(Carbon::parse($coordPagamento->dataInizio),Carbon::parse($coordPagamento->dataFine));
            return $coordPagamento->iban == $mf_iban && $isBeetwen;
        });

        if (count($hasMyIBAN) == 0){
            return false;
        }
        Log::info('Iban Ugov esistente [ iban =' . $myiban . ']'); 
        return true;
    }

    public static function inserimentoIbanUgov($myiban, $id_ab, $cf, $intestazione){
        $iban = new IBAN($myiban);
        if (!PrecontrattualeService::esisteIbanUgov($myiban,$id_ab, $cf)){
            if (!$iban->Verify()){
                throw new Exception("Errore: IBAN non corretto");
            }
            //inserisci
            //controllo IBAN e codice nazione
            $codNazione = $iban->Country();
            $abi = $iban->Bank();
            $cab = $iban->Branch();
            $cin = $iban->NationalChecksum();
            $numeroConto = $iban->Account();
            $format = $iban->MachineFormat();

            //inserimento coordinate
            $sc = new SoapControllerWSACPersonaFisica(new SoapWrapper);   
            $wsdtoPagamento = WsdtoPagamento::fromBasicData(
                $abi,
                $cab,
                $cin,
                $intestazione, //'TEST OLIVA ENRICO 1', 
                $numeroConto, 
                'CC', 
                $codNazione, 
                Carbon::now()->toIso8601String(), //inzio validità
                "2223-03-03T00:00:00+01:00", //Carbon::now()->addYears(3)->toIso8601String(), //fine validità
                $iban->MachineFormat());   

            $response = $sc->inserisciCoordPagamento($id_ab, null, $cf, $wsdtoPagamento);

            if ($response->idCoordPagamento){
                Log::info('Inserimento Iban Ugov [ idCoordPagamento =' . $response->idCoordPagamento . ']'); 
            }
            return $response;
        }
        return null;
    }

}