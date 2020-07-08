<?php

namespace App\Service;

use Carbon\Carbon;
use App\Permission;
use DateTime;
use Auth;
use App\User;
use App\AttachmentType;

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
use App\Http\Controllers\Api\V1\StrutturaInternaController;
use App\Http\Controllers\Api\V1\PersonaInternaController;

class TitulusHelper 
{    
    /*
    * funzione prende in ingresso un documento o un fascicolo (struttura xml)
    * e aggiunge un riferimento interno RPA
    * il riferimento è il responsabile ufficio della persona che è Loggata nel sistema o passata come parametro
    */
    public static function addRPA($element, $userid = null){        
        $pers = null;
        //lettura responsabile da ugov
        if ($userid){
            $pers =  User::find($userid)->personaleRespons()->first();   
        }else{
            $pers =  Auth::user()->personaleRespons()->first();   
        }
        $mapping = $pers->mappingufficio()->first();

        
        $element->addRPA($mapping->descrizione_uff, $pers->nomepersona);    
    }    

   /*
    * funzione prende in ingresso un documento o un fascicolo (struttura xml) e l'unità organizzativa a cui è assegnata la convenzione (dipartimento)
    * e aggiunge un riferimento interno RPA    
    * il riferimento è il responsabile ufficio della persona che è Loggata nel sistema o passata come parametro
    */ 
    public static function addRPA_Titulus($element, $unitaorganizzativa_uo){       
        // da titulus leggo il codice del responsabile del dipartimento di riferimento         
        // dal codice leggo il nome del resp sempre su titulus
        $mapping = MappingUfficio::where('unitaorganizzativa_uo', $unitaorganizzativa_uo)->first();

        $ctrStr = new StrutturaInternaController();        
        $strint = $ctrStr->getminimal($mapping->strutturainterna_cod_uff); //'SI000084'       

        $ctrPers = new PersonaInternaController();
        $persint = $ctrPers->getminimal($strint->cod_responsabile); //'PI000083'

        $element->addRPA($mapping->descrizione_uff, $persint->nomepersona);         
         
    }

    /*
    * funzione prende in ingresso un documento o un fascicolo (struttura xml) 
    * e aggiunge l'utente corrente come operatore incaricato
    */
    public static function addCC_Titulus($element){  
        $pers =  Auth::user()->personaleRespons()->first(); 
        $ctrPers = new PersonaInternaController();
        $persint = $ctrPers->getminimalByName($pers->utenteNomepersona); //'PI000083'

        $ctrStr = new StrutturaInternaController();        
        $strint = $ctrStr->getminimal($persint->cod_uff);

        $element->addCC($strint->nome, $pers->utenteNomepersona); 
    }

    /** 
     *  Invia al destinatario del documento protocollato con nrecord l'email 
     */
    public static function sendDocumentByEmail($nrecord){
        $sc = new SoapControllerTitulus(new SoapWrapper);
        //1) startworkflow
        $response = $sc->startWorkflow($nrecord,'invioPEC1');
         
        //2) getWorkflowId
        $response = $sc->getWorkflowId($nrecord);        
        $obj = simplexml_load_string($response);
        $workflowid = $obj->Workflow['id'];        
        
        //3) getWorkflowAction        
        $response = $sc->getWorkflowAction($nrecord,$workflowid);         
        $obj = simplexml_load_string($response);
        $actionId = $obj->WorkflowAction['id'];          

        //4) continueWorkflow
        $response = $sc->continueWorkflow($nrecord, $workflowid, $actionId);                  
    }


    public static function downloadAttachment($num_prot){
        $sc = new SoapControllerTitulus(new SoapWrapper);                
        $response = $sc->loadDocument($num_prot,false);        
        $obj = simplexml_load_string($response);
        $document = $obj->Document;        
        $doc = $document->doc;                
        foreach ($doc->files->children('xw',true) as $file) {
            //restuisce il primo
            $fileId = (string) $file->attributes()->name;            
            $attachmentBean =  $sc->getAttachment($fileId);
            $attachmentBean->title =  (string) $file->attributes()->title;  
            return $attachmentBean;
        }
        return null;
    }

    
}