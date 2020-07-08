<?php

namespace App\Http\Controllers;

use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Http\Controllers\iSearch;
//https://github.com/artisaninweb/laravel-soap
//add php.ini ext-soap

class SoapControllerTitulusAcl implements iSearch
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
  public function __construct(SoapWrapper $soapWrapper = NULL)
  {
    $this->soapWrapper = new SoapWrapper;    
    $this->initTitulusAcl();
  }

  private function initTitulusAcl() 
  {
    $this->soapWrapper->add('titulusAcl', function ($service) {
      $service
        ->wsdl('https://'.config('titulus.username').':'.config('titulus.password').'@'.config('titulus.host').'/titulus_ws/services/Acl4?wsdl')
        ->trace(true)
        ->options([
          'soap_version' => SOAP_1_1,
          'login' => config('titulus.username'),
          'password' => config('titulus.password')
      ]);        
    });        
  }

  public function getSessionId(){
    $sessionId = null;
    $this->soapWrapper->client('titulusAcl', function ($client) use  (&$sessionId) {     
      if (array_key_exists("JSESSIONID", $client->getCookies())) { 
        $sessionId = $client->getCookies()['JSESSIONID'];      
      }
    });
    return $sessionId;
  }


  public function nextTitlePage($sessionId) 
  {
    $this->soapWrapper->client('titulusAcl', function ($client) use ($sessionId){
      $client->cookie('JSESSIONID', $sessionId);
    });
    $response = $this->soapWrapper->call('titulusAcl.nextTitlePage', []);
    return $response;
  }

  public function titlePage($sessionId, $pageIndex) 
  {
    $this->soapWrapper->client('titulusAcl', function ($client) use ($sessionId){
      $client->cookie('JSESSIONID', $sessionId);
    });

    $response = $this->soapWrapper->call('titulusAcl.titlePage', [
      'pageIndex' => (int)$pageIndex,
    ]);

    return $response;
  }
  
  public function load($physdoc, $lock = false) 
  {
      $response = $this->soapWrapper->call('titulusAcl.load', [
        'id' => $physdoc,
        'lock' => $lock,
      ]);
      return $response;
  }

  /**
   * searchAcl function.  
   *  
   * @param string $query   
   * @param string $orderby   
   * @param array $fields   
   * @param int titlePageSize
   * @return 
   * 
   **/
  public function search($query, $orderby, $fields, $titlePageSize, $sessionId = null) {
    
    if ($sessionId){
      $this->soapWrapper->client('titulus', function ($client) use ($sessionId){
        $client->cookie('JSESSIONID', $sessionId[0]);
      });
    }

    $response = $this->soapWrapper->call('titulusAcl.search', [
      'query' => $query,
      'orderby' => $orderby,
      'params' => [
        'fields' => $fields,
        'titlePageSize' => $titlePageSize,
      ]
    ]);     
    return $response;
  }

  public function lookup($nome_uff = null, $nome_persona) 
  {
      $response = $this->soapWrapper->call('titulusAcl.lookup', [
        'nome_uff' => $nome_uff,
        'nome_persona' => $nome_persona,
      ]);
      return $response;
  }


}