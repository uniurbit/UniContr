<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Controllers\FirmaIOClient;
use Illuminate\Support\Facades\Http;
use App\Models\Firmaio\SignatureRequest;
use App\Models\Firmaio\DocumentMetadata;
use App\Models\Firmaio\Attrs;
use App\Models\Firmaio\SignatureField;
use Illuminate\Http\UploadedFile;
use App\Service\FirmaUSIGNService;
use App\Service\PdfSignService;
use Storage;
class FirmaTest extends TestCase
{
  
    // ./vendor/bin/phpunit  --testsuite Unit --filter testCreateDossier   
    public function testCreateDossier()
    {       
      
      $this->markTestSkipped('codice già utitlizzato');

        $client = new FirmaIOClient();
        $response = $client->createDossier("Contratto di Insegnamento");

        $this->assertTrue($response->successful());
        //var_dump($response->object()->id);        

        $this->assertEquals($response->object()->id,"01H7AAPQ258A3M89TWZZ7GHDCA");
      
    }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testGetDossier   
    public function testGetDossier()
    {       
        $client = new FirmaIOClient();
        $response = $client->getDossier("01H7AAPQ258A3M89TWZZ7GHDCA");

        //dump($response->body());
        $this->assertTrue($response->successful());    
      
    }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testGetSignerId   
    public function testGetSignerId()
    {       
        $client = new FirmaIOClient();
        $response = $client->getSigner("LVONRC76C29L500F");
        dump($response->body());
        $this->assertTrue($response->successful());
        $this->assertEquals($response->object()->id,"791199f7-52bd-4693-9a5b-6818df39c6b4");      
    }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testModelloCreazioneAttrsAndStore   
    public function testModelloCreazioneAttrsAndStore()
    {       
        //OGGETTI DI MODELLO
        $sr = new SignatureRequest([
         'dossier_id' => config('firmaio.dossier_id'),         
        ]);

        $dm = new DocumentMetadata([
         'title' => 'Contratto'
        ]);

        $sf = new SignatureField();        
        $sf->attrs = new Attrs([
            "coordinates" => [
               "x" => 0,
               "y" => 0
            ],
            "size" => [
               "w" => 0,
               "h" => 0,
            ],
            "page" => 0            
        ]);
        $dm->setRelation('signatureFields', collect($sf));
        $sr->setRelation('documentsMetadata', $dm);    
        
        //var_dump($sr->toJson(JSON_PRETTY_PRINT));

        $this->assertNotNull($sr);        
        $this->assertEquals($sr->toJson(),'{"dossier_id":"01H97XRW3N008GYQEB01TVS16F","documents_metadata":{"title":"Contratto","signature_fields":{"attrs":{"coordinates":{"x":0,"y":0},"size":{"w":0,"h":0},"page":0}}}}');
      
    }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testModelloCreazioneAttrsAndStore1   
   public function testModelloCreazioneAttrsAndStore1()
   {             
         
      $attrs = new Attrs([
            "coordinates" => [
               "x" => 0,
               "y" => 0
            ],
            "size" => [
               "w" => 0,
               "h" => 0,
            ],
            "page" => 0            
      ]);     
   
      $dm = new DocumentMetadata([
         'title' => 'Contratto',
         'signature_fields' =>  collect(new SignatureField([
                                          'attrs' => $attrs
                                       ])       
         ),
      ]);

      $sr = new SignatureRequest([
         'dossier_id' => config('firmaio.dossier_id'),   
         'documents_metadata' => $dm      
      ]);

      //var_dump($sr->toJson());

      $this->assertNotNull($sr);
      $this->assertEquals($sr->toJson(),'{"dossier_id":"01H97XRW3N008GYQEB01TVS16F","documents_metadata":{"title":"Contratto","signature_fields":{"attrs":{"coordinates":{"x":0,"y":0},"size":{"w":0,"h":0},"page":0}}}}');
      
   }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testValidateDocumentRequest   
    public function testValidateDocumentRequest()
    {                    
         $client = new FirmaIOClient();
         $file = null;
         if (Storage::disk('local')->exists('contratto_test.pdf')) {
            $file = Storage::disk('local')->get('contratto_test.pdf');
         }else{
            $file = UploadedFile::fake()->create('document.pdf',100);
         }   
         $position = PdfSignService::getSignPosition($file)[0];

         $response = $client->validateDocument($file, $position);        
         //dump($response->getBody()->getContents());
         $this->assertNotNull($response);     
         $this->assertEquals(200,$response->getStatusCode());         
    }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testCreateSignatureRequest   
   public function testCreateSignatureRequest()
   {       
      $this->markTestSkipped('codice già utitlizzato');

       $client = new FirmaIOClient();
       $signature_id = "791199f7-52bd-4693-9a5b-6818df39c6b4";
       $dossier_id = "01H7AAPQ258A3M89TWZZ7GHDCA";
       $file = Storage::disk('local')->get('contratto_test.pdf');
       $position = PdfSignService::getSignPosition($file)[0];

       $response = $client->createSignatureRequest($signature_id, $position, $dossier_id);
       dump( $response->json());
       $this->assertTrue($response->successful());
       $this->assertEquals($response->object()->id,"01H7J1JNFJCRXD0DCYG18P1DY3");
       $this->assertEquals($response->json()['documents'][0]['id'],"01H7J1JNFJCRXD0DCYG18P1DY3");

       //RISULTATO della chiamata    
       //signature_requesto_id = 01H7J1JNFJCRXD0DCYG18P1DY3   
       //document_id = 01H7J1JNFJHAJB8NQG8XG5GKM0

   }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testUploadURL   
    public function testUploadURL()
    {       
      $this->markTestSkipped('codice già utitlizzato');

        $client = new FirmaIOClient();
        //ID NECESSARI
        $signature_request_id ="01H7J1JNFJCRXD0DCYG18P1DY3";
        $document_id = "01H7J1JNFJHAJB8NQG8XG5GKM0";

        $response = $client->uploadURL($signature_request_id, $document_id);
        $this->assertTrue($response->successful());
        dump( $response->json());
        $uploadUrl = $response->json();
        
       // "https://iopsignst.blob.core.windows.net/uploaded-documents/01H7J2B6QA5XTD6P69FBKY43A9?sv=2021-10-04&spr=https%2Chttp&st=2023-08-11T10%3A30%3A17Z&se=2023-08-11T10%3A45%3A17Z&sr=b&sp=racw&sig=M38C0Si7wCw7RtAo0O9KhCgEjC65n64%2BD7bdKnnA1T4%3D&rsct=application%2Fpdf"
        //upload del file pdf
        $fileContent = Storage::disk('local')->get('test.pdf');
        //$fileContent = $pdf->output();
        $response = $client->upload($uploadUrl, $fileContent);
        dump($response->body());
        $this->assertTrue($response->successful());
    }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testUploadFirmaIO 
    public function testUploadFirmaIO()
    {  
      $this->markTestSkipped('codice già utitlizzato');

         $client = new FirmaIOClient();
         $uploadUrl = "https://iopsignst.blob.core.windows.net/uploaded-documents/01H7J3H6JFQ36YCCN79Y96S4PD?sv=2021-10-04&spr=https%2Chttp&st=2023-08-11T10%3A51%3A02Z&se=2023-08-11T11%3A06%3A02Z&sr=b&sp=racw&sig=mBSElkgkGkvQFy4LosUKFi3RnOIlrPLitLuKBmxzd7w%3D&rsct=application%2Fpdf";
         $fileContent = Storage::disk('local')->get('test.pdf');
         //$fileContent = $pdf->output();
         $response = $client->upload($uploadUrl, $fileContent);
         dump($response->headers());
         dump($response->body());
         $this->assertTrue($response->successful());
    }


   // ./vendor/bin/phpunit  --testsuite Unit --filter testGetSignatureRequest   
   public function testGetSignatureRequest()
   {       
      $client = new FirmaIOClient();
      //ID NECESSARI
      $signature_request_id ="01H7J1JNFJCRXD0DCYG18P1DY3";

      $response = $client->getSignatureRequest($signature_request_id);
      //dump($response->json());
      $this->assertTrue($response->successful());
      $this->assertEquals($response->object()->id,$signature_request_id);      
   }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testPubblicazioneRichiestadiFirma   
   public function testPubblicazioneRichiestadiFirma()
   {       
      $this->markTestSkipped('codice già utitlizzato');

      $client = new FirmaIOClient();
      //ID NECESSARI
      $signature_request_id ="01H7J1JNFJCRXD0DCYG18P1DY3";

      $response = $client->pubblicazioneRichiesta($signature_request_id);
      dump( $response->json());
      $this->assertTrue($response->successful());
   }


   // ./vendor/bin/phpunit  --testsuite Unit --filter testSendNotification   
   public function testSendNotification()
   {       
      $this->markTestSkipped('codice già utitlizzato');

      $client = new FirmaIOClient();
      //ID NECESSARI
      $signature_request_id ="01H7J1JNFJCRXD0DCYG18P1DY3";

      $response = $client->sendNotification($signature_request_id);
      dump( $response->json());
      $this->assertTrue($response->successful());
      
      //risposta ricevuta
      //"io_message_id" => "01H7JA3JF44031JX6FGZT5S1S1"
   }

   // ./vendor/bin/phpunit  --testsuite Unit --filter testDownloadSignedDocument   
   public function testDownloadSignedDocument()
   {       
      $this->markTestSkipped('contratto di firma scatudo');

      $client = new FirmaIOClient();
   
      $signature_request_id ="01H7J1JNFJCRXD0DCYG18P1DY3";      
      $response = $client->getSignatureRequest($signature_request_id);
      $data = $response->json();

      $response = $client->download($data['documents'][0]['url']);
     // dump( $response->body());
      $this->assertTrue($response->successful());

      Storage::disk('local')->delete('testfirmaio.pdf');
     
      Storage::disk('local')->put('testfirmaio.pdf', $response);      
      $exists = Storage::disk('local')->exists('testfirmaio.pdf');        

      $this->assertTrue($exists);       
   }



        


   //USIGN

   // ./vendor/bin/phpunit  --testsuite Unit --filter testUploadUSIGN   
   public function testUploadUSIGN()   
   {       
      $this->markTestSkipped('codice già utitlizzato');

      $service = new FirmaUSIGNService();
      
      $file = Storage::disk('local')->get('contratto_test.pdf');   
      //$position = PdfSignService::getSignPosition($file)[0];
      $attrs = [
               "coordinates" => [
                  "x" => 10,
                  "y" => 10
               ],
               "size"=>[
                  "w" => 10,
                  "h" => 10
               ],
               "page" => 1
         ]; 
      $response = $service->client->upload("3F217368CE026D965DDF278C3B1D60EC2B9396AD7ACDEA37C5189BF87257D487",$file, $attrs);      
      $this->assertNotNull($response);  
      $this->assertTrue($response->successful());  
   } 
   
    // ./vendor/bin/phpunit  --testsuite Unit --filter testUploadFinishedUSIGN   
    public function testUploadFinishedUSIGN()   
    {       
       $service = new FirmaUSIGNService();
       $response = $service->client->uploadFinished("3F217368CE026D965DDF278C3B1D60EC2B9396AD7ACDEA37C5189BF87257D487");      
       $this->assertNotNull($response);  
       $this->assertTrue($response->successful());  
    }
       
   // ./vendor/bin/phpunit  --testsuite Unit --filter testOtpTypeUSIGN   
   public function testOtpTypeUSIGN()   
   {       
      $service = new FirmaUSIGNService();
      $response = $service->client->otpType("3F217368CE026D965DDF278C3B1D60EC2B9396AD7ACDEA37C5189BF87257D487");      
      $this->assertNotNull($response);  
      $this->assertTrue($response->successful());  
      //var_dump($response->json());
   }

    // ./vendor/bin/phpunit  --testsuite Unit --filter testSendOtpUSIGN   
    public function testSendOtpUSIGN()   
    {       
      $this->markTestSkipped('codice già utitlizzato');
      
       $service = new FirmaUSIGNService();
       $response = $service->client->sendOtp("68CC066C17F0DE992F5DFF89AA4D74D5946821127386756E8896498C1EA8BFBE");      
       $this->assertNotNull($response); 
       dump($response->json()); 
       $this->assertTrue($response->successful());  
    }
}
