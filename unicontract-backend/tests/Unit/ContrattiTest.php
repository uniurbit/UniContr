<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Insegnamenti;
use App\Precontrattuale;
use App\PrecontrattualePerGenerazione;
use App\Http\Controllers\Api\V1\InsegnamentiController;
use App\Http\Controllers\Api\V1\PrecontrattualeController;
use Storage;
use App\AttachmentType;
use App\Attachment;
use App\User;
use App\Models\InsegnamUgov;
use App\Models\Anagrafica;
use PDF;
use App\Repositories\PrecontrattualeRepository;
use App\Repositories\AnagraficaRepository;
use App\Repositories\P2RapportoRepository;
use App\Repositories\B1ConflittoInteressiRepository;
use App\Mail\FirstMail;
use Illuminate\Support\Facades\Mail;
use App\Service\PrecontrattualeService;
use App\Service\UtilService;
use App\Exports\PrecontrattualeExport;
use App\Exports\ContrUgovExport;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\InsegnamUgovController;
use App\Http\Controllers\Api\V1\ContrUgovController;
use App;
use App\Models\Ugov\ContrUgov;
use App\Models\Ugov\RelazioniDgUgov;


class ContrattiTest extends TestCase
{

    // ./vendor/bin/phpunit  --testsuite Unit --filter testPrecontrattuale
    public function testPrecontrattuale()
    {        
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $repo = new PrecontrattualeRepository($this->app);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());        
        $response = $repo->newIncompat(ContrattiData::getNewIncomp($response->insegn_id));
        $response = $repo->newInformativa(ContrattiData::getNewPrivacyInformativa($response->insegn_id));

        $this->assertNotNull($response->docente_id);
        $this->assertNotNull($response->insegn_id);
        $this->assertGreaterThan(0, $response->b2_incompatibilita_id);
        $this->assertGreaterThan(0, $response->b6_trattamento_dati_id);

        Precontrattuale::find($response->id)->delete();
    }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testDateInsegnamento
    public function testDateInsegnamento()
    {        
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

      
        foreach(Insegnamenti::where('coper_id','24550')->get() as $pre) {
            $pre->precontr()->delete();
        }
        Insegnamenti::where('coper_id','24550')->delete();



        //IMPORT INSEGNAMENTO DOCENTE
        $repo = new PrecontrattualeRepository($this->app);
        $service = new PrecontrattualeService($repo);

        $controller  = new PrecontrattualeController($repo,$service);

        $precontr = ContrattiData::getPrecontrattuale();
        $precontr['insegnamento'][ 'data_ini_contr'] = "22-12-2019";        
        $precontr['insegnamento'][ 'data_fine_contr'] = "22-11-2019";    
        
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');                
        $request->replace($precontr);
        
        $response = $controller->newPrecontrImportInsegnamento($request);


        $this->assertNotNull($response);
        $this->assertFalse($response['success']);
    }


    /**
     * A basic test example.
     *
     * @return void
     */
    // ./vendor/bin/phpunit  --testsuite Unit --filter testInsegamentiRelation
    public function testInsegamentiRelation()
    {        
        $insegn = new Insegnamenti();        
        $insegn->fill(ContrattiData::getArrayContratti());
        $success = $insegn->save();     
        $this->assertTrue($success);


        $precontr = $insegn->precontr()->get();        
        $this->assertCount(0, $precontr);

        $insegn->delete();
        
    }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testQueryPrecontr
    public function testQueryPrecontr(){
        
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        //insegnamenti
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');
        $request->replace([
            'rules' => [
                [],
            ],
            'limit' => 25,
            ]);  

        $contr = new InsegnamentiController();
        $result = $contr->query($request);

        $this->assertNotNull($result);

        //precontrattuale
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');
        $request->replace([
            'rules' => [
                [],
            ],
            'limit' => 25,
            ]);  

        $repo = new PrecontrattualeRepository($this->app);            
        $contr = new PrecontrattualeController($repo);
        $result = $contr->query($request);

        $this->assertNotNull($result);

    }

    //./vendor/bin/phpunit  --testsuite Unit --filter testReadStoreAttachment
    public function testReadStoreAttachment(){
        $filename = 'filetest.txt';
        Storage::disk('local')->put('filetest.txt', 'Primo contenuto');
        $contents = Storage::get('filetest.txt');

        $user = User::where('email','test.admin@uniurb.it')->first();   

        $type = AttachmentType::where('codice','DOC_CV')->first();
        /** @var Attachment $attachment */
        $attachment = new Attachment();
        $attachment->docnumber = 'ab123';
        $attachment->emission_date = '12-03-2019';
        $attachment->model()->associate($user);
        $attachment->fromStream($contents, $filename, $type);
        $attachment->save();
        //$conv->attachments()->save($attachment);
        //echo($attachment);

        $tot = $user->attachments->count();
        $this->assertGreaterThan(0,$tot);
        $attachment->delete();
        $user->refresh();
        $tot = $tot - 1;
        $this->assertEquals($tot, $user->attachments->count());
    }

     //./vendor/bin/phpunit  --testsuite Unit --filter testGeneraPdfConflitto
    public function testGeneraPdfConflitto() {   
             
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $repo = new PrecontrattualeRepository($this->app);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());

        //P2
        $repo = new P2RapportoRepository($this->app);
        $repo->store(ContrattiData::getP2Rapporto($response->insegn_id));
        
        //ANAGRAFICA
        $repo = new AnagraficaRepository($this->app);
        $repo->store(ContrattiData::getAnagrafica($response->insegn_id));

        $repo =new B1ConflittoInteressiRepository($this->app);
        $repo->store(ContrattiData::getConflitto($response->insegn_id));                

        $pre = Precontrattuale::with(['anagrafica','user','validazioni','insegnamento','conflittointeressi.cariche','conflittointeressi.incarichi'])->find($response->id);                

        $pdf = PDF::loadView('pdfConflittoInteressi',['pre' => $pre]);

        Storage::disk('local')->delete('test.pdf');
     
        Storage::disk('local')->put('test.pdf', $pdf->output());      
        $exists = Storage::disk('local')->exists('test.pdf');        

        $this->assertTrue($exists);

        Precontrattuale::find($response->id)->delete();
    }

     //./vendor/bin/phpunit  --testsuite Unit --filter testGeneraPdfConflittoTrasparenza
    public function testGeneraPdfConflittoTrasparenza() { 
             
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);
                    
        $repo = new PrecontrattualeRepository($this->app);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());

        //P2
        $repo = new P2RapportoRepository($this->app);
        $repo->store(ContrattiData::getP2Rapporto($response->insegn_id));
        
        //ANAGRAFICA
        $repo = new AnagraficaRepository($this->app);
        $repo->store(ContrattiData::getAnagrafica($response->insegn_id));

        $repo =new B1ConflittoInteressiRepository($this->app);
        $repo->store(ContrattiData::getConflitto($response->insegn_id));      

        $pre = Precontrattuale::with(['anagrafica','user','validazioni','insegnamento','conflittointeressi.cariche','conflittointeressi.incarichi'])->find($response->id);                

        $pdf = PDF::loadView('pdfConflittoInteressiTrasparenza',['pre' => $pre]);

        Storage::disk('local')->delete('test.pdf');
     
        Storage::disk('local')->put('test.pdf', $pdf->output());      
        $exists = Storage::disk('local')->exists('test.pdf');        

        $this->assertTrue($exists);

        Precontrattuale::find($response->id)->delete();
    }

    //./vendor/bin/phpunit  --testsuite Unit --filter testSendFirstEmail
    public function testSendFirstEmail() { 
                        
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $repo = new PrecontrattualeRepository($this->app);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());

        $this->assertNotNull($response->docente_id);
        $this->assertNotNull($response->insegn_id);

        $ctr = new InsegnamentiController();
        try {
            $result = $ctr->sendFirstEmail($response->insegn_id);
                            
        } catch (\Throwable $th) {
            $this->assertTrue(false);
            Precontrattuale::find($response->id)->delete();    
        }

        $pre = Precontrattuale::with(['sendemailsrcp'])->where('insegn_id',$response->insegn_id)->first();           

        $this->assertGreaterThan(0,count($pre->sendemailsrcp));

        Precontrattuale::find($response->id)->delete();    

    }
  

    
    //./vendor/bin/phpunit  --testsuite Unit --filter testGenerazioneContratto
    public function testGenerazioneContratto() { 

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        //IMPORT INSEGNAMENTO DOCENTE
        $repo = new PrecontrattualeRepository($this->app);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());   
        //PRESTAZIONE PROFESSIONALE     
        $repo->newPrestazioneProfessionale(ContrattiData::getPrestazioneProfessionale($response->insegn_id));   
        //P2
        $repo = new P2RapportoRepository($this->app);
        $repo->store(ContrattiData::getP2Rapporto($response->insegn_id));
        
        //ANAGRAFICA
        $repo = new AnagraficaRepository($this->app);
        $repo->store(ContrattiData::getAnagrafica($response->insegn_id));

        $result = PrecontrattualeService::createContrattoBozza($response->insegn_id);

        Storage::disk('local')->delete('test.pdf');
     
        Storage::disk('local')->put('test.pdf', base64_decode($result['filevalue']));      
        $exists = Storage::disk('local')->exists('test.pdf');        

        $this->assertTrue($exists);

        Precontrattuale::find($response->id)->delete();
    }

    //./vendor/bin/phpunit  --testsuite Unit --filter testTitulusContratto
    public function testTitulusContratto() { 
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        //IMPORT INSEGNAMENTO DOCENTE
        $repo = new PrecontrattualeRepository($this->app);
        $service = new PrecontrattualeService($repo);
        $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());        
        
        $repo->newPrestazioneProfessionale(ContrattiData::getPrestazioneProfessionale($response->insegn_id));   

        //P2
        $repo = new P2RapportoRepository($this->app);
        $repo->store(ContrattiData::getP2Rapporto($response->insegn_id));
        
        //ANAGRAFICA
        $repo = new AnagraficaRepository($this->app);
        $repo->store(ContrattiData::getAnagrafica($response->insegn_id));
     
        

        $result = $service->presaVisioneAccettazione($response->insegn_id);

        //$result = PrecontrattualeService::saveContrattoBozzaTitulus();
    
        $this->assertNotNull($result);

        Precontrattuale::find($response->id)->delete();
    }


     // ./vendor/bin/phpunit  --testsuite Unit --filter test_exportCSV
     public function test_exportCSV(){
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        //IMPORT INSEGNAMENTO DOCENTE
        $repo = new PrecontrattualeRepository($this->app);
        $service = new PrecontrattualeService($repo);

        $controller  = new PrecontrattualeController($repo,$service);

        //costruzione query 
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');        
        $rules = json_decode('{"rules":[],"limit":1000,"sessionId":null,"page":null}',true);
        $request->json()->replace($rules);

        $findparam = new \App\FindParameter($request->all());  
        //controllo numero di record restituiti 
        $collection = UtilService::alldata(new Precontrattuale, $request, $findparam);
        $total = $controller->query($request)->total();
        $this->assertGreaterThanOrEqual($collection->count(), $total);

        //prendi i parametri 
        $findparam = $controller->queryparameter($request);          
        (new PrecontrattualeExport($request,$findparam))->store('precontrattuali.csv');

        //esportazione csv
        $response = $controller->export($request);
        $this->assertEquals('text/csv', $response->headers->get('Content-Type'));

    }


    // ./vendor/bin/phpunit  --testsuite Unit --filter test_exportXLS
    public function test_exportXLS(){
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        //IMPORT INSEGNAMENTO DOCENTE
        $repo = new PrecontrattualeRepository($this->app);
        $service = new PrecontrattualeService($repo);

        $controller  = new PrecontrattualeController($repo,$service);

        //costruzione query 
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');        
        $rules = json_decode('{"rules":[
            {
                "field":"insegnamento.aa",
                "operator":"=",
                "value":"2019",
                "fixcondition":true,
                "type":"select"
            }
        ],"limit":1000,"sessionId":null,"page":null}',true);
        $request->json()->replace($rules);

        $findparam = new \App\FindParameter($request->json()->all());  
        $findparam->includes = 'insegnamento,user,validazioni,p2naturarapporto,d1inps,d4fiscali,d2inail'; 
        //controllo numero di record restituiti 
        $collection = UtilService::alldata(new Precontrattuale, $request, $findparam);
        $total = $controller->query($request)->total();
        $this->assertGreaterThanOrEqual($collection->count(), $total);

        //prendi i parametri 
        //$findparam = $controller->queryparameter($request);          
        //(new PrecontrattualeExport($request,$findparam))->store('precontrattuali.xls');

        //esportazione csv
        $response = $controller->exportxls($request);
        $this->assertEquals("attachment; filename=precontrattuali.xlsx", $response->headers->get('content-disposition'));

    }




    //./vendor/bin/phpunit  --testsuite Unit --filter testGenerazioneReport
    public function testGenerazioneReport() { 

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $result = PrecontrattualeService::makePdfForReport('DISB');

        Storage::disk('local')->delete('test.pdf');    
        Storage::disk('local')->put('test.pdf', $result->download());      
        $exists = Storage::disk('local')->exists('test.pdf');        

        $this->assertTrue($exists);
    }

         
    //./vendor/bin/phpunit  --testsuite Unit --filter testCalcoloNumeroRinnovi
    public function testCalcoloNumeroRinnovi() {
     
        $datiUgov = DB::connection('oracle')->table('V_IE_DI_COPER V1')->join('V_IE_DI_COPER V2', function($join) {
            $join->on('V2.AF_GEN_COD', '=', 'V1.AF_GEN_COD')
                 ->on('V2.cod_fis','=','V1.cod_fis')
                 ->on('V2.data_ini_contratto','<','V1.data_ini_contratto')
                 ->where('V2.motivo_atto_cod','=','BAN_INC')
                 ->where('V1.COPER_ID','=',25244);    
        })
        ->select('V2.data_ini_contratto as ultima_nuova_attribuzione','V1.data_ini_contratto as data_contratto_corrente')
        ->orderBy('V2.data_ini_contratto', 'DESC')->first();            

        $count = DB::connection('oracle')->table('V_IE_DI_COPER V1')->join('V_IE_DI_COPER V2', function($join) {
            $join->on('V2.AF_GEN_COD', '=', 'V1.AF_GEN_COD')
                 ->on('V2.cod_fis','=','V1.cod_fis')                             
                 ->where('V1.COPER_ID','=',25244);    
        })->where('V2.data_ini_contratto','<',$datiUgov->data_contratto_corrente)
        ->where('V2.data_ini_contratto','>=',$datiUgov->ultima_nuova_attribuzione)->count();
               
        $this->assertNotNull($datiUgov);
        $this->assertEquals(2,$count);        

        $this->assertEquals(0, InsegnamUgovController::contatoreInsegnamenti(17418));

        $this->assertEquals(2, InsegnamUgovController::contatoreInsegnamenti(25244));   
        $this->assertEquals(1, InsegnamUgovController::contatoreInsegnamenti(25236));   
        $this->assertEquals(0, InsegnamUgovController::contatoreInsegnamenti(23690));   
    }

  
    //./vendor/bin/phpunit  --testsuite Unit --filter testStatoCivile
    public function testStatoCivile() {
        $list = Anagrafica::statoCivileLista('M');            
        $this->assertEquals("Coniugato",$list[0]['value']);
        $this->assertEquals(18,count($list));
        $list = Anagrafica::statoCivileLista('F');  
        $this->assertEquals("Coniugata",$list[0]['value']);
    }

  //./vendor/bin/phpunit  --testsuite Unit --filter testGenPrecontrattualeReport
  public function testGenPrecontrattualeReport() { 

    $user = User::where('email','enrico.oliva@uniurb.it')->first();
    $this->actingAs($user);

    //IMPORT INSEGNAMENTO DOCENTE
    $repo = new PrecontrattualeRepository($this->app);
    $response = $repo->newPrecontrImportInsegnamento(ContrattiData::getPrecontrattuale());   
    //PRESTAZIONE PROFESSIONALE     
    $repo->newPrestazioneProfessionale(ContrattiData::getPrestazioneProfessionale($response->insegn_id));   
    //P2
    $repo = new P2RapportoRepository($this->app);
    $repo->store(ContrattiData::getP2Rapporto($response->insegn_id));
    
    //ANAGRAFICA
    $repo = new AnagraficaRepository($this->app);
    $repo->store(ContrattiData::getAnagrafica($response->insegn_id));

    $pres = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','a2modalitapagamento','validazioni'])
        ->where('insegn_id',$response->insegn_id)->first();
    $pdf = PrecontrattualeService::makePdfPrecontrattualeReport($pres);

    Storage::disk('local')->delete('test.pdf');

    Storage::disk('local')->put('test.pdf', $pdf->download());      
    $exists = Storage::disk('local')->exists('test.pdf');        

    $this->assertTrue($exists);

    Precontrattuale::find($response->id)->delete();
  }

   //./vendor/bin/phpunit  --testsuite Unit --filter testUgovCompensi
   public function testUgovCompensi() { 

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $contr = ContrUgov::where('ID_DG', 2045192)->first();
        $this->assertNotNull($contr);

        $rel = $contr->relazioni()->get();
        $tot_rel = $rel->count();                  

        $comps = $contr->compensi()->get();
        $tot_comps = $comps->count();     

        //Storage::disk('local')->delete('test.pdf');
        //Storage::disk('local')->put('test.pdf', $comps[0]->stampa_conguaglio);      
        //$exists = Storage::disk('local')->exists('test.pdf');        
    
        //$this->assertTrue($exists);
        $this->assertNotNull($comps);
        $this->assertEquals(2, $tot_comps);        

        foreach ($comps as $compenso) {
            $ords = $compenso->ordinativi()->get();
            $this->assertEquals(3, $ords->count());       
        }

        $totRRate = $contr->relazioniRate()->get()->count();
        $this->assertEquals(2, $totRRate);        

        $totRate = $contr->rate()->get()->count();
        $this->assertEquals(2, $totRate);    

        $totImporto = $contr->rate()->get()->sum('importo');
        $this->assertEquals(2500, $totImporto);    

        $contr = ContrUgov::with(['compensi','rate','compensi.ordinativi'])->where('id_siadi', 21354)->first(['id_x_contr','id_dg','id_siadi','num_rate','fl_gratuito','costo_totale']);
        $this->assertNotNull($contr);    
        $this->assertEquals(2, $contr->rate->count());
        $this->assertEquals(2, $contr->compensi->count());
   }

    //./vendor/bin/phpunit  --testsuite Unit --filter testUgovPagamentoCompensi
    public function testUgovPagamentoCompensi() { 
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $contrs = ContrUgov::with(['compensi','compensi.ordinativi'])
            ->has('relazioniratecompensoordinativo',DB::raw('num_rate')) 
            ->whereIn('id_siadi', [21354, 22368, 25815, 24550])->get();            

        $this->assertNotNull($contrs);
        
        foreach ($contrs as $contr) {
            $this->assertEquals($contr->num_rate, $contr->compensi->count());
        }
      
    }

     //vuole la connessione ugov
     // ./vendor/bin/phpunit  --testsuite Unit --filter test_ContrUgovExportCSV
     public function test_ContrUgovExportCSV(){
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $controller  = new ContrUgovController();

        //costruzione query 
        $request = new \Illuminate\Http\Request();
        $request->setMethod('POST');        
        $rules = json_decode('{"rules":[
            {
                "field":"insegnamento.aa",
                "operator":"=",
                "value":"2019",
                "fixcondition":true,
                "type":"select"
            },
            {
                "operator":"=",
                "field":"insegnamento.dip_cod",
                "type":"select",
                "value":"005019"
            }
        ],"limit":1000,"sessionId":null,"page":null}',true);
        $request->json()->replace($rules);

        //$findparam = new \App\FindParameter($request->all());  

        //prendi i parametri 
        $response = $controller->queryparameter($request);          
        (new ContrUgovExport($request,$response["findparam"],$response["precontrs"]))->store('daticontabili.csv');

        //esportazione csv
        $response = $controller->export($request);
        $this->assertEquals('text/csv', $response->headers->get('Content-Type'));

    }
       
     //vuole la connessione ugov
     // ./vendor/bin/phpunit  --testsuite Unit --filter test_InseganmentiConSegmentiUgov
    public function test_InseganmentiConSegmentiUgov(){
        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $insegnamentoUgov = InsegnamUgov::with(['segmenti'])->where('COPER_ID', 28128)            
            ->first(['coper_id', 'tipo_coper_cod', 'data_ini_contratto', 'data_fine_contratto', 
                'coper_peso', 'ore', 'compenso', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 
                'numero', 'data', 'des_tipo_ciclo', 'sett_des', 'sett_cod','af_radice_id']);  

        $this->assertNotNull($insegnamentoUgov);
        $this->assertNotNull($insegnamentoUgov->segmenti);
        $this->assertEquals($insegnamentoUgov->segmenti->count(), 2);        

        $this->assertNotNull($insegnamentoUgov->sett_des);
        $this->assertNotNull($insegnamentoUgov->sett_cod); 

        $insegnamentoUgov1 = InsegnamUgov::where('COPER_ID', 28128)            
            ->first(['coper_id', 'tipo_coper_cod', 'data_ini_contratto', 'data_fine_contratto', 
                'coper_peso', 'ore', 'compenso', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 
                'numero', 'data', 'des_tipo_ciclo', 'sett_des', 'sett_cod','af_radice_id']); 

        //$this->assertNull($insegnamentoUgov1->segmenti);
        $this->assertNotNull($insegnamentoUgov1->sett_des); 
        $this->assertNotNull($insegnamentoUgov1->sett_cod); 

    }


}
