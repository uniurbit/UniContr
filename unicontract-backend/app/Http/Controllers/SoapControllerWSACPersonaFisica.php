<?php

namespace App\Http\Controllers;

use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Response\SaveDocumentResponse;
use App\Http\Controllers\iSearch;
use Illuminate\Support\Facades\Log;
use Artisaninweb\SoapWrapper\Exceptions\ServiceNotFound;
use Exception;
use \stdClass;
//add php.ini ext-soap
//https://github.com/artisaninweb/laravel-soap


class SoapControllerWSACPersonaFisica 
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
    $this->initUgov();    
  }

  private function initUgov() 
  {
    $this->soapWrapper->add('ugov', function ($service) {
      $service
        ->wsdl('https://'.config('ugov.host').'/ws-ac/ws/private/PersonaFisica?wsdl')
        ->trace(true)       
        ->options([
          'soap_version' => 1,          
          'login' => config('ugov.username'),
          'password' => config('ugov.password'),     
          'features' => SOAP_SINGLE_ELEMENT_ARRAYS,
          'cache_wsdl'   => WSDL_CACHE_NONE     
          //'maintain'=>true, //SESSION_MAINTAIN_PROPERTY
      ]);        
    });        
  }

  public function retry($func, array $args){

    $retries = 3;
    for ($try = 0; $try < $retries; $try++) {
        try {
          
          return $this->soapWrapper->call($func, array($args));

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
   * elencaPersone 
   *
   * Occorre valorizzare almeno uno dei seguenti campi: nome, cognome o matricola. 
   *
   * @param string $nome
   * @param string $cognome
   * @param string $matricola
   * 
   **/

  public function elencaPersone($wsdtoPersonaFisicaSearch) {        

    $response = $this->retry('ugov.elencaPersone', array(
      'dtoRicerca' => $wsdtoPersonaFisicaSearch
    ));            
    
    return $response;
  }


  /**
   * elencaCoordPagamento
   * 
   * @param string $codiceFiscale
   * @param string $matricola
   * @param string $idInterno
   */
  public function elencaCoordPagamento($wsdtoPersonaFisicaSearch, $matricola) {

    $response = $this->retry('ugov.elencaCoordPagamento', array(
      'dtoRicerca' => $wsdtoPersonaFisicaSearch,
      'matricola' => $matricola
    ));

    return $response;
  }

  /**
   * @param int $idInternoPersona
   * @param string $matricola
   * @param WsdtoPagamento $coordPagamento
   */
  public function inserisciCoordPagamento($idInternoPersona, $matricola, $codiceFiscale, $coordPagamento) {

    $response = $this->retry('ugov.inserisciCoordPagamento', array(
      'idInternoPersona' => $idInternoPersona,
      'matricola' => $matricola,
      'codiceFiscale' => $codiceFiscale,
      'coordPagamento' => $coordPagamento
    ));      
    
    return $response;
  }

    /**
   * @param int $idInternoPersona
   * @param int $idInternoCoordPag
   */
  public function eliminaCoordPagamento($idInternoCoordPag, $idInternoPersona) {

    $response = $this->retry('ugov.eliminaCoordPagamento', array(
      'idInternoPersona' => $idInternoPersona,
      'idInternoCoordPag' => $idInternoCoordPag,
    ));      
    
    return $response;
  }


}