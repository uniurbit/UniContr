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
        
        
    //     <files>
    //     <xw:file index="yes" name="cBFJBqj5fHp5OB8V6sT7SA==_002129466-FS_FILES-a3358a3d-b628-4d57-ae9c-f447dec28242[3].pdf" principale="true" signed="true" title="Contratto di insegnamento">
    //       <DigestMethod Algorithm="SHA-256"/>
    //       <DigestValue>3a08f7f3108b18004db63b556229943d624e2f95ca587e99160bbe9257ee1515</DigestValue>
    //       <chkin operatore="unicontr2_ws utente" cod_operatore="PI000246" data="20240212" ora="11:29:25"/>
    //       <chkout operatore="Calcagnini Giorgio (Rettore)" cod_operatore="000180" data="20240212" ora="13:06:18"/>
    //       <xw:file name="nVGS/S7+F8p5kFktXhGWLw==_002130124-FS_FILES-fedfecb3-e681-4de6-b329-e74411f7814e[1].pdf" title="Contratto di insegnamento" index="yes" principale="true" signed_from="002129466-FS_FILES-a3358a3d-b628-4d57-ae9c-f447dec28242[3].pdf" signed="true" sealed="false" timestamped="false">
    //         <DigestMethod Algorithm="SHA-256"/>
    //         <DigestValue>765c28d60c34b5c13336fe798a09198a2891201ebe3371cc75294af495da23de</DigestValue>
    //         <chkin operatore="Calcagnini Giorgio (Rettore)" cod_operatore="000180" data="20240212" ora="13:06:18"/>
    //       </xw:file>
    //     </xw:file>
    //   </files>
        foreach ($doc->files->children('xw',true) as $file) {

            $signed = (string) $file->attributes()->signed;
            if ($signed == 'false'){
                foreach ($file->children('xw',true) as $internalfile) {
                    $signed = (string) $internalfile->attributes()->signed;
                    if ($signed == 'true'){
                        $fileId = (string) $internalfile->attributes()->name;                    
                        $attachmentBean =  $sc->getAttachment($fileId);
                        $attachmentBean->title =  (string) $internalfile->attributes()->title;               
                        return $attachmentBean;                          
                    }
                }
            }
            if ($signed == 'true'){
                foreach ($file->children('xw',true) as $internalfile) {
                    $signed = (string) $internalfile->attributes()->signed;
                    if ($signed == 'true'){
                        $fileId = (string) $internalfile->attributes()->name;                    
                        $attachmentBean =  $sc->getAttachment($fileId);
                        $attachmentBean->title =  (string) $internalfile->attributes()->title;               
                        return $attachmentBean;                          
                    }
                }
            }

            //restuisce il primo
            $fileId = (string) $file->attributes()->name;            
            $attachmentBean =  $sc->getAttachment($fileId);
            $attachmentBean->title =  (string) $file->attributes()->title;  
            return $attachmentBean;
        }
        return null;
    }

      /**
     * getTitulusUrl
     *
     * @param  mixed $id numero di protocollo o nrecord
     * @return void
     */
    public static function getTitulusUrl($id){
        $sc = new SoapControllerTitulus(new SoapWrapper); 
        $resp = $sc->getDocumentURL($id);
        $parse = parse_url($resp);        
        if (isset($parse['query'])){
            return [
                'url'=> config('titulus.url').$parse['path'].'?'.$parse['query']
            ];
        }else{
            return [
                'url'=> $resp 
            ];
        }
    }
}