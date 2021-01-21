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
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Request\SaveParams;
use App\Soap\Request\AttachmentBean;
use App\Models\Titulus\Fascicolo;
use App\Models\Titulus\Documento;
use App\Models\Titulus\Rif;
use App\Models\Titulus\Element;
use Illuminate\Support\Facades\Log;
use App\MappingUfficio;
use Carbon\Carbon;
use App\Repositories\PrecontrattualeRepository;
use View;
use App\Models\StoryProcess;


class PrecontrattualeService implements ApplicationService
{

 /**
     * @var PrecontrattualeRepository
     */
    private $repo;
    public function __construct(PrecontrattualeRepository $repo){
        $this->repo = $repo;
    }


    public static function createStoryProcess($description, $insegn_id){
        $sp = new StoryProcess();
        $sp->insegn_id = $insegn_id;
        $sp->descrizione = $description;
        $sp->user_id = Auth::user()->id;
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



    public static function makePdfForContratto($pre, $type){
        $pdf = PDF::loadView('contratto', ['pre' => $pre, 'type'=>$type]);        
        if (App::environment(['local'])) {
            //con il javasctipt - something whent wrong in locale WINDOWS
            $header = View::make('contratto.headerlocal');      
            $pdf->setOption('header-html', $header);
        }else{            
            $header = View::make('contratto.header');      
            $pdf->setOption('header-html', $header);                      
        }
        $pdf->setOption('enable-local-file-access',true);
        $pdf->setOption('load-error-handling','ignore');
        $pdf->setOption('margin-top','44');           
        $pdf->setOption('margin-right','30');                             
        $pdf->setOption('margin-bottom','25');              
        $pdf->setPaper('a4');

        return $pdf;
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
            $value = $pdf->download();
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
            $value = $pdf->download();
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
        //aggiorna titulus ref e attachment
        $result = $this->repo->newPresavisioneAccettazione($data, $pre);
        // email segreteria del rettore catia rossi
        EmailService::sendEmailByType($insegn_id,'APP_FIRMA');

        return $result;
    }

    public static function saveContrattoBozzaTitulus($pre) {
            
        $sc = new SoapControllerTitulus(new SoapWrapper);

        $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA'); 

        $attachment = null;
        $attachment['filename'] = 'Contratto'. $pre->user->nameTutorString() .'.pdf';        
        $filevalue = $pdf->download();

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
       
        $newDoc = new \SimpleXMLElement($doc->toXml());    
        TitulusExtraDoc::xml_append($newDoc, $extra);

        return $newDoc->asXML();
    }

    public static function makePdfFromPresForReport($dip, $pres){

        $grouped = $pres->sortBy('insegnamento.data_delibera')->groupBy('aaNum');        
        $grouped = $grouped->sortKeysDesc();
        $pdf = PDF::loadView('reports.lista_precontrattuali', ['grouped' => $grouped, 'dip' => $dip]);                
        //$pdf->setOption('load-error-handling','ignore');
        $pdf->setOption('margin-top','10');           
        $pdf->setOption('margin-right','10');                             
        $pdf->setOption('margin-left','10');                             
        $pdf->setOption('margin-bottom','10');              
        $pdf->setPaper('a3','landscape'); 

        return $pdf;
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
            $value = $pdf->download();
            $attach['filevalue'] =  base64_encode( $value);
        } catch (\Throwable $th) {
            throw $th;
        }        
        
        return $attach;
    }    

    public static function makePdfPrecontrattualeReport($pre){               

        $pdf = PDF::loadView('reports.reportcontratto', ['pre' => $pre]);                
        //$pdf->setOption('load-error-handling','ignore');
        $pdf->setOption('margin-top','20');           
        $pdf->setOption('margin-right','20');                             
        $pdf->setOption('margin-left','20');                             
        $pdf->setOption('margin-bottom','20');              
        $pdf->setPaper('a4'); //,

        return $pdf;
    }


}