<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use App\Http\Controllers\SoapControllerWSACPersonaFisica;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Request\SaveParams;
use App\Soap\Request\AttachmentBean;
use Illuminate\Support\Facades\Storage;
use Spatie\ArrayToXml\ArrayToXml;
use App\Models\Titulus\Fascicolo;
use App\Models\Titulus\Documento;
use App\Models\Titulus\Rif;
use App\Models\Titulus\Element;
use App\Models\PersonaInterna;
use App\Models\StrutturaInterna;
use Illuminate\Support\Collection;
use App\Service\QueryTitulusBuilder;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Api\V1\StrutturaInternaController;
use App\Http\Controllers\Api\V1\PersonaInternaController;
use App\Http\Controllers\Api\V1\DocumentoController;
use Auth;
use App\User;
use App\Soap\Request\WsdtoPersonaFisicaSearch;
use App\Soap\Request\WsdtoPagamento;
use PHP_IBAN\IBAN;
use Carbon\Carbon;


class UgovTest extends TestCase
{

    use WithoutMiddleware;
      
   
    // ./vendor/bin/phpunit  --testsuite Unit --filter testBasicLoadElencaPersone    
    public function testBasicLoadElencaPersone()
    {
        $sc = new SoapControllerWSACPersonaFisica(new SoapWrapper);          
        $wsdtoPersonaFisicaSearch = WsdtoPersonaFisicaSearch::fromBasicData(null, 'oliva', null);
        $response = $sc->elencaPersone($wsdtoPersonaFisicaSearch);
        
        $obj = $response;
        $this->assertNotNull($obj->PersonaFisica);  
        $this->assertGreaterThan(0, count($response->PersonaFisica));          
    }
    
    // ./vendor/bin/phpunit  --testsuite Unit --filter testBasicLoadElencaCoordPagamento        
    public function testBasicLoadElencaCoordPagamento()
    {
        $id_ab = 39842; //26686; //3006; //39842;
        $sc = new SoapControllerWSACPersonaFisica(new SoapWrapper);   
        $wsdtoPersonaFisicaSearch = WsdtoPersonaFisicaSearch::fromBasicData(null, null, null, $id_ab);             
        $response = $sc->elencaCoordPagamento($wsdtoPersonaFisicaSearch, null);
        
        $obj = $response;
        $this->assertNotNull($obj->listaCoordPagamento); 
        //cambiato parametro "features" nella chiamata wsdl  
        //$this->assertTrue(is_object($obj->listaCoordPagamento));
        $this->assertTrue(is_array($obj->listaCoordPagamento));        

        $hasMyIBAN = array_filter($obj->listaCoordPagamento, function ($coordPagamento) {
            //trovato e valido altrimenti aggiungo 
            $isBeetwen = Carbon::now()->between(Carbon::parse($coordPagamento->dataInizio),Carbon::parse($coordPagamento->dataFine));
            return $coordPagamento->iban == 'IT03Z0882613305000070170144' && $isBeetwen;
        });

        $this->assertGreaterThan(0, count($hasMyIBAN));

        // <listaCoordPagamento>
            // <abi>08826</abi>
            // <bic xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            // <cab>13305</cab>
            // <cin>Z</cin>
            // <codEsternoCoordPag xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            // <codMod>CC</codMod>
            // <codNazione>IT</codNazione>
            // <dataFine>2222-02-02T00:00:00+01:00</dataFine>
            // <dataInizio>2018-05-01T00:00:00+02:00</dataInizio>
            // <delega>false</delega>
            // <desBanca>BANCA DI PESARO CREDITO COOPERATIVO SOC. COOP. A R.L.</desBanca>
            // <desFiliale>BANCA DI PESARO CREDITO COOPERATIVO</desFiliale>
            // <desMod>Conto corrente bancario</desMod>
            // <descrizione xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            // <iban>IT03Z0882613305000070170144</iban>
            // <idCoordPag>40981</idCoordPag>
            // <intestazioneConto>OLIVA ENRICO</intestazioneConto>
            // <note xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>
            // <numeroConto>000070170144</numeroConto>
            // <priorita>0</priorita>
            // <usoCSA>true</usoCSA>
            // <usoRimborso>false</usoRimborso>
        // </listaCoordPagamento>

    }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testValidazioneIBAN        
   public function testValidazioneIBAN()
   {
        $iban = new IBAN('IT03Z0882613305000070170144');
        $result = $iban->Verify();
        $this->assertTrue($result);
        $codNazione = $iban->Country();
        $this->assertEquals('IT',$codNazione);
   }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testInserisciCoordPagamento        
    public function testInserisciCoordPagamento()
    {
        //controllo IBAN e codice nazione
        $iban = new IBAN('IT03Z0882613305000070170144');
        $this->assertTrue($iban->Verify());
        $codNazione = $iban->Country();
        $this->assertEquals('IT',$codNazione);
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
            'TEST OLIVA ENRICO 1', 
            $numeroConto, 
            'CC', 
            $codNazione, 
            Carbon::now()->toIso8601String(), //inzio validità
            "2222-02-02T00:00:00+01:00", //Carbon::now()->addYears(3)->toIso8601String(), //fine validità
            $iban->MachineFormat());         
        $response = $sc->inserisciCoordPagamento(39842, null, null, $wsdtoPagamento);
        
        $obj = $response;
        //idCoordPagamento:53979
        $this->assertNotNull($obj->idCoordPagamento);  

        //dati inseriti da verificare 
        // abi: "00000"
        // bic: null
        // cab: "00000"
        // cin: null
        // codEsternoCoordPag: null
        // codMod: "CC"
        // codNazione: "IT"
        // dataFine: "2020-02-02T00:00:00+01:00"
        // dataInizio: "2018-05-01T00:00:00+02:00"
        // delega: false
        // desBanca: "Non assegnato"
        // desFiliale: "Non assegnato"
        // desMod: "Conto corrente bancario"
        // descrizione: null
        // iban: "IT03Z0882613305000070170144"
        // idCoordPag: 53979
        // intestazioneConto: "TEST OLIVA ENRICO 1"
        // note: null
        // numeroConto: null
        // priorita: 1
        // usoCSA: false
        // usoRimborso: false

        //leggi i dati 
        $wsdtoPersonaFisicaSearch = WsdtoPersonaFisicaSearch::fromBasicData(null, null, null, 39842);    
        $response = $sc->elencaCoordPagamento($wsdtoPersonaFisicaSearch, null);

        //pulizia dati
        //attenzione permesso non presente in ambiente di produzione e preprod
        //$response = $sc->eliminaCoordPagamento($obj->idCoordPagamento,39842);

        $obj = $response;
        $this->assertNotNull($obj);  

    }


}

