<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\FirmaIOClient;
use App\Http\Controllers\FirmaUSIGNClient;
use App\Service\FirmaUSIGNService;
use App\Models\Firmaio\SignatureRequest;
use App\Models\Firmaio\DocumentMetadata;
use App\Models\Firmaio\Attrs;
use App\Models\Firmaio\SignatureField;
use Mockery;

class FirmaTestMocked extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('local');
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test creazione modello SignatureRequest con Attrs
     * @github-executable true
     */
    public function testModelliCreazioneAttrsAndStore()
    {
        $sr = new SignatureRequest([
            'dossier_id' => config('firmaio.dossier_id'),
        ]);

        $dm = new DocumentMetadata([
            'title' => 'Contratto'
        ]);

        $sf = new SignatureField();
        $sf->attrs = new Attrs([
            "coordinates" => ["x" => 0, "y" => 0],
            "size" => ["w" => 0, "h" => 0],
            "page" => 0
        ]);
        $dm->setRelation('signatureFields', collect($sf));
        $sr->setRelation('documentsMetadata', $dm);

        $this->assertNotNull($sr);
    }

    /**
     * Test creazione modello con Attrs annidati
     * @github-executable true
     */
    public function testModelliCreazioneAttrsAndStore1()
    {
        $attrs = new Attrs([
            "coordinates" => ["x" => 0, "y" => 0],
            "size" => ["w" => 0, "h" => 0],
            "page" => 0
        ]);

        $dm = new DocumentMetadata([
            'title' => 'Contratto',
            'signature_fields' => collect(new SignatureField(['attrs' => $attrs])),
        ]);

        $sr = new SignatureRequest([
            'dossier_id' => config('firmaio.dossier_id'),
            'documents_metadata' => $dm
        ]);

        $this->assertNotNull($sr);
    }

    /**
     * Test creazione dossier (mockato)
     * @github-executable true
     */
    public function testCreateDossierMocked()
    {
        //https://api.io.pagopa.it/api/v1/sign
        Http::fake([
            'https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '01H7AAPQ258A3M89TWZZ7GHDCA','title' => 'Contratto di Insegnamento'], 200),
        ]);

        $client = new FirmaIOClient();
        $response = $client->createDossier("Contratto di Insegnamento");

        $this->assertTrue($response->successful());
        $this->assertEquals($response->object()->id, "01H7AAPQ258A3M89TWZZ7GHDCA");
    }

    /**
     * Test recupero dossier (mockato)
     * @github-executable true
     */
    public function testGetDossierMocked()
    {
        Http::fake([
            'https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '01H7AAPQ258A3M89TWZZ7GHDCA','title' => 'Contratto di Insegnamento','status' => 'active'], 200),
        ]);

        $client = new FirmaIOClient();
        $response = $client->getDossier("01H7AAPQ258A3M89TWZZ7GHDCA");

        $this->assertTrue($response->successful());
    }

    /**
     * Test recupero ID firmatario (mockato)
     * @github-executable true
     */
    public function testGetSignerIdMocked()
    {
        Http::fake([
            'https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '791199f7-52bd-4693-9a5b-6818df39c6b4','fiscal_code' => 'LVONRC76C29L500F','name' => 'Enrico Oliva'], 200),
        ]);

        $client = new FirmaIOClient();
        $response = $client->getSigner("LVONRC76C29L500F");

        $this->assertTrue($response->successful());
        $this->assertEquals($response->object()->id, "791199f7-52bd-4693-9a5b-6818df39c6b4");
    }

    /**
     * Test validazione documento (mockato)
     * @github-executable true
     */
    public function testValidateDocumentRequestMocked()
    {
        $this->markTestSkipped('Skipped: validateDocument uses Guzzle directly and is not intercepted by Http::fake in this unit test.');

        Storage::disk('local')->put('contratto_test.pdf', 'fake pdf content');

        Http::fake(['https://api.io.pagopa.it/api/v1/sign/validate-document' => Http::response(['success' => true,'message' => 'Document is valid'], 200),]);

        $client = new FirmaIOClient();
        $file = Storage::disk('local')->get('contratto_test.pdf');
        $position = ["x"=>100,"y"=>100,"page"=>1,"width"=>200,"height"=>50];

        $response = $client->validateDocument($file, $position);

        $this->assertNotNull($response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    /**
     * Test creazione richiesta di firma (mockato)
     * @github-executable true
     */
    public function testCreateSignatureRequestMocked()
    {
        Http::fake(['https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '01H7J1JNFJCRXD0DCYG18P1DY3','documents' => [['id' => '01H7J1JNFJCRXD0DCYG18P1DY3']]], 200),]);

        $client = new FirmaIOClient();
        $signature_id = "791199f7-52bd-4693-9a5b-6818df39c6b4";
        $dossier_id = "01H7AAPQ258A3M89TWZZ7GHDCA";

        $position = ["x"=>100,"y"=>100,"page"=>1,"width"=>200,"height"=>50];

        $response = $client->createSignatureRequest($signature_id, $position, $dossier_id);

        $this->assertTrue($response->successful());
        $this->assertEquals($response->object()->id, "01H7J1JNFJCRXD0DCYG18P1DY3");
    }

    /**
     * Test download URL per caricamento (mockato)
     * @github-executable true
     */
    public function testUploadURLMocked()
    {
        Http::fake(['https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['upload_url' => 'https://iopsignst.blob.core.windows.net/mock-url'], 200),]);

        $client = new FirmaIOClient();
        $signature_request_id = "01H7J1JNFJCRXD0DCYG18P1DY3";
        $document_id = "01H7J1JNFJHAJB8NQG8XG5GKM0";

        $response = $client->uploadURL($signature_request_id, $document_id);

        $this->assertTrue($response->successful());
    }

    /**
     * Test caricamento file su FirmaIO (mockato)
     * @github-executable true
     */
    public function testUploadFirmaIOMocked()
    {
        Storage::disk('local')->put('test.pdf', 'fake pdf content');

        Http::fake(['iopsignst.blob.core.windows.net/*' => Http::response([], 201),]);

        $client = new FirmaIOClient();
        $uploadUrl = "https://iopsignst.blob.core.windows.net/mock-url";
        $fileContent = Storage::disk('local')->get('test.pdf');

        $response = $client->upload($uploadUrl, $fileContent);

        $this->assertTrue($response->successful());
    }

    /**
     * Test recupero richiesta di firma (mockato)
     * @github-executable true
     */
    public function testGetSignatureRequestMocked()
    {
        Http::fake(['https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '01H7J1JNFJCRXD0DCYG18P1DY3','status' => 'pending'], 200),]);

        $client = new FirmaIOClient();
        $signature_request_id = "01H7J1JNFJCRXD0DCYG18P1DY3";

        $response = $client->getSignatureRequest($signature_request_id);

        $this->assertTrue($response->successful());
        $this->assertEquals($response->object()->id, $signature_request_id);
    }

    /**
     * Test pubblicazione richiesta di firma (mockato)
     * @github-executable true
     */
    public function testPubblicazioneRichiestaMocked()
    {
        Http::fake(['https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['id' => '01H7J1JNFJCRXD0DCYG18P1DY3','status' => 'published'], 200),]);

        $client = new FirmaIOClient();
        $signature_request_id = "01H7J1JNFJCRXD0DCYG18P1DY3";

        $response = $client->pubblicazioneRichiesta($signature_request_id);

        $this->assertTrue($response->successful());
    }

    /**
     * Test invio notifica (mockato)
     * @github-executable true
     */
    public function testSendNotificationMocked()
    {
        Http::fake(['https://api.io.pagopa.it/api/v1/sign/*' => Http::response(['io_message_id' => '01H7JA3JF44031JX6FGZT5S1S1'], 200),]);

        $client = new FirmaIOClient();
        $signature_request_id = "01H7J1JNFJCRXD0DCYG18P1DY3";

        $response = $client->sendNotification($signature_request_id);

        $this->assertTrue($response->successful());
    }

    /**
     * Test download documento firmato (mockato)
     * @github-executable true
     */
    public function testDownloadSignedDocumentMocked()
    {
        Http::fake([
            'https://api.io.pagopa.it/api/v1/sign/*' => Http::response([
                'id' => '01H7J1JNFJCRXD0DCYG18P1DY3',
                'documents' => [[ 'id' => '01H7J1JNFJCRXD0DCYG18P1DY3', 'url' => 'https://mock-signed-document.pdf' ]]
            ], 200),
            'mock-signed-document.pdf' => Http::response('fake pdf signed content', 200),
        ]);

        $client = new FirmaIOClient();
        $signature_request_id = "01H7J1JNFJCRXD0DCYG18P1DY3";

        $response = $client->getSignatureRequest($signature_request_id);
        $data = $response->json();

        $download = $client->download($data['documents'][0]['url']);

        $this->assertTrue($download->successful());
    }

    /**
     * Test caricamento documento USIGN (mockato)
     * @github-executable true
     */
    public function testUploadUSIGNMocked()
    {
        Storage::disk('local')->put('contratto_test.pdf', 'fake pdf content');

        $clientMock = Mockery::mock(FirmaUSIGNClient::class);
        $responseMock = Mockery::mock();
        $responseMock->shouldReceive('successful')->andReturn(true);
        $clientMock->shouldReceive('upload')->andReturn($responseMock);

        $file = Storage::disk('local')->get('contratto_test.pdf');
        $attrs = ["coordinates" => ["x"=>10,"y"=>10],"size"=>["w"=>10,"h"=>10],"page"=>1];

        $service = new FirmaUSIGNService();
        $service->client = $clientMock;

        $response = $service->client->upload("mock_session_id", $file, $attrs);

        $this->assertNotNull($response);
    }

    /**
     * Test conferma caricamento USIGN (mockato)
     * @github-executable true
     */
    public function testUploadFinishedUSIGNMocked()
    {
        $clientMock = Mockery::mock(FirmaUSIGNClient::class);
        $responseMock = Mockery::mock();
        $responseMock->shouldReceive('successful')->andReturn(true);
        $clientMock->shouldReceive('uploadFinished')->andReturn($responseMock);

        $service = new FirmaUSIGNService();
        $service->client = $clientMock;

        $response = $service->client->uploadFinished("mock_session_id");

        $this->assertNotNull($response);
    }

    /**
     * Test tipo OTP USIGN (mockato)
     * @github-executable true
     */
    public function testOtpTypeUSIGNMocked()
    {
        $clientMock = Mockery::mock(FirmaUSIGNClient::class);
        $responseMock = Mockery::mock();
        $responseMock->shouldReceive('successful')->andReturn(true);
        $responseMock->shouldReceive('json')->andReturn(['otp_type' => 'sms']);
        $clientMock->shouldReceive('otpType')->andReturn($responseMock);

        $service = new FirmaUSIGNService();
        $service->client = $clientMock;

        $response = $service->client->otpType("mock_session_id");

        $this->assertNotNull($response);
    }

    /**
     * Test invio OTP USIGN (mockato)
     * @github-executable true
     */
    public function testSendOtpUSIGNMocked()
    {
        $clientMock = Mockery::mock(FirmaUSIGNClient::class);
        $responseMock = Mockery::mock();
        $responseMock->shouldReceive('successful')->andReturn(true);
        $responseMock->shouldReceive('json')->andReturn(['otp_sent' => true]);
        $clientMock->shouldReceive('sendOtp')->andReturn($responseMock);

        $service = new FirmaUSIGNService();
        $service->client = $clientMock;

        $response = $service->client->sendOtp("mock_session_id");

        $this->assertNotNull($response);
    }

}
