<?php

namespace App\Http\Controllers;

use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Response\SaveDocumentResponse;
use App\Http\Controllers\iSearch;
use Illuminate\Support\Facades\Log;
use Artisaninweb\SoapWrapper\Exceptions\ServiceNotFound;
use Exception;
//https://github.com/artisaninweb/laravel-soap
//add php.ini ext-soap


class SoapControllerTitulus implements iSearch
{
  /**
   * @var SoapWrapper
   */
  public $soapWrapper;

  /**
   * SoapController constructor.
   *
   * @param SoapWrapper $soapWrapper
   */
  public function __construct(SoapWrapper $soapWrapper)
  {
    $this->soapWrapper = $soapWrapper;
    $this->initTitulus();    
  }

  private function initTitulus() 
  {
    $this->soapWrapper->add('titulus', function ($service) {
      $service
        ->wsdl('https://'.config('titulus.username').':'.config('titulus.password').'@'.config('titulus.host').'/titulus_ws/services/Titulus4?wsdl')
        ->trace(true)       
        ->options([
          'soap_version' => SOAP_1_1,          
          'login' => config('titulus.username'),
          'password' => config('titulus.password'),          
          //'maintain'=>true, //SESSION_MAINTAIN_PROPERTY
      ]);        
    });        
  }

  public function retry($func, array $args){

    $retries = 3;
    for ($try = 0; $try < $retries; $try++) {
        try {
          
          return $this->soapWrapper->call($func, $args);

        } catch (SoapFault | ServiceNotFound $e) {          
            Log::info('[Retry] '.$try);                   
            Log::error($e);  

            //se al terzo tentativo ho ancora errore rilancio e esco
            if ($try==2){
              throw $e;
            }
            
            sleep(1);
            continue;
        } catch (Exception $e){
          //faultcode:"soapenv:Server.userException" Operazione non consentita        
          //faultcode:"soapenv:Server.userException" Non trovato
          //faultcode:"Client" end point non trovato
          throw $e;
        }
        break;
    }
  }

  /**
   * loadDocument constructor.
   *
   * @param string $contentField
   * @param string $contentProviderIdField
   * 
   **/

  public function loadDocument($id, $lock) {
    $response = $this->retry('titulus.loadDocument', [
      'id' =>  $id, 
      'lock'   => $lock,       
    ]);      
    
    return $response;
  }

  public function getAttachment($fileId){
    $response = $this->soapWrapper->call('titulus.getAttachment', [
      'fileId' =>  $fileId,             
    ]);      

    return $response;
  }



   /**
   * newFolder function.  
   *  
   * @param xmlFolder $xmlFolder   
   * @return newFolder
   * 
   **/
  public function newFascicolo($xmlFolder) {

    $response = $this->soapWrapper->call('titulus.newFolder', [
      'xmlFolder' => $xmlFolder       
    ]);      
       
    return $response;
  }

  /**
   * saveDocument function.  
   *  
   * @param SaveDocument $saveDocument   
   * @return SaveDocumentResponse
   * 
   **/
  public function saveDocument($saveDocument, $sessionId = null) {    

    if ($sessionId){
      $this->soapWrapper->client('titulus', function ($client) use ($sessionId){
        $client->cookie('JSESSIONID', $sessionId[0]);
      });
    }

    // if ($cookies){
    //   $this->soapWrapper->client('titulus', function ($client) use ($cookies){
    //     foreach ($cookies as $key => $value){
    //       $client->cookie($key, implode(';',$value));
    //     }        
    //   });
    // }

    $response = $this->retry('titulus.saveDocument', [
      'document' => $saveDocument->getDocument(),
      'attachmentBeans' => $saveDocument->getAttachmentBeans(),
      'params' => [
        'pdfConversion' => $saveDocument->getSaveParams()->getPdfConversion(),
        'sendEMail' => $saveDocument->getSaveParams()->getSendEMail(),
      ]
    ]);      
       
    return $response;
  }

    /**
   * saveDocument function.  
   *  
   * @param string $query   
   * @param string $orderby   
   * @param array $fields   
   * @param int titlePageSize
   * @param string sessionId (opzionale)
   * @return 
   * 
   **/
  public function search($query, $orderby, $fields, $titlePageSize, $sessionId = null) {

    if ($sessionId){
      $this->soapWrapper->client('titulus', function ($client) use ($sessionId){
        $client->cookie('JSESSIONID', $sessionId[0]);
      });
    }

    $response = $this->soapWrapper->call('titulus.search', [
      'query' => $query,
      'orderby' => $orderby,
      'params' => [
        'fields' => $fields,
        'titlePageSize' => $titlePageSize,
      ]
    ]);     
    return $response;
  }

  public function getSessionId(){
    $sessionId = null;
    $this->soapWrapper->client('titulus', function ($client) use  (&$sessionId) {
      if (array_key_exists("JSESSIONID", $client->getCookies())) {       
        $sessionId = $client->getCookies()['JSESSIONID'];      
      }
    });
    return $sessionId;
  }
 
  public function nextTitlePage($sessionId) 
  {
    $this->soapWrapper->client('titulus', function ($client) use ($sessionId){
      $client->cookie('JSESSIONID', $sessionId);
    });
    $response = $this->soapWrapper->call('titulus.nextTitlePage', []);
    return $response;
  }

  public function titlePage($sessionId, $pageIndex) 
  {
    $this->soapWrapper->client('titulus', function ($client) use ($sessionId){
      $client->cookie('JSESSIONID', $sessionId);
    });

    $response = $this->soapWrapper->call('titulus.titlePage', [
      'pageIndex' => (int)$pageIndex,
    ]);

    return $response;
  }
  
/**
 * Consente l'inserimento di un documento in un fascicolo.
 * @param $xmlFolder  La specifica XML con cui si forniscono informazioni relative al documento ed il relativo fascicolo
 * @return "busta" XML rappresentativa del documento inserito.
 */
  public function addInFolder($xmlInFolder) {
    $response = $this->soapWrapper->call('titulus.addInFolder', [
      'xmlInFolder' => $xmlInFolder,
    ]);
    return $response;
  }


  /**
   * @param id del documento nrecord o phydocs
   */
  public function getWorkflowId($id){
    $response = $this->soapWrapper->call('titulus.getWorkflowId', [
      'id' => $id,   
    ]);
    return $response;
  }

  /**
   * @param $id id del docmento
   * @param $workflowId identificativo del workflow trovato con getWorkflowId
   */  
  public function getWorkflowAction($id, $workflowId){
    $response = $this->soapWrapper->call('titulus.getWorkflowAction', [
      'id' => $id,
      'workflowId' => $workflowId,
    ]);
    return $response;
  }
  
  /**
   * Inizio del workflow
   * @param $id id del documento
   * @param $workflowName nome del workflow
   */
  public function startWorkflow($id, $workflowName){
    $response = $this->soapWrapper->call('titulus.startWorkflow', [
      'id' => $id,
      'workflowName' => $workflowName,
    ]);
    return $response;
  }

  /**
   * Esecuzione di una azione del workflow
   * @param $id id del documento
   * @param $workflowId id del workflow
   * @param $actionId id azione
   */
  public function continueWorkflow($id, $workflowId, $actionId){
    $response = $this->soapWrapper->call('titulus.continueWorkflow', [
      'id' => $id,
      'workflowId' => $workflowId,
      'actionId' => $actionId,
    ]);
    return $response;
  }
  

   /**
   * Restituisce url del documento
   * @param $id nrecord, numero di protocollo, numero di repertorio
   */
  public function getDocumentURL($id){
    $response = $this->soapWrapper->call('titulus.getDocumentURL', [
      'id' => $id,    
    ]);
    return $response;
  }


  /**
   * applica la segnatura
   * @param $id nrecord, numero di protocollo, numero di repertorio
   */
  public function applyRegistrationMark($id){
    $response = $this->soapWrapper->call('titulus.applyRegistrationMark', [
      'id' => $id,    
    ]);
    return $response;
  }


  /**
   * applica la segnatura
   * @param $id nrecord, numero di protocollo, numero di repertorio
   * @param $html boolean
   */
  public function getRegistrationMark($id,$html){
    $response = $this->soapWrapper->call('titulus.getRegistrationMark', [
      'id' => $id,    
      'html' => $html,    
    ]);
    return $response;
  }
  
  /**
   * imposta utente reale
   * @param $user nome utente
   * @param $pnumber numero identificativo
   */
  public function setWSUser($user,$pnumber){

    // $this->soapWrapper->client('titulus', function ($client){
    //   $client->cookie('maintain', true);
    // });

    $response = $this->soapWrapper->call('titulus.setWSUser', [
      'user' => $user,    
      'pnumber' => $pnumber,    
    ]);
    return $response;
  }


}