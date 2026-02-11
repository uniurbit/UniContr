<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Tests\Unit\ContrattiData;
use GuzzleHttp\Psr7\MultipartStream;
use GuzzleHttp\Psr7\Request;
use GuzzleHttp\Psr7\Message;
use GuzzleHttp\Psr7\Utils;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;
use App\Service\MultipartStreamFirmaIO;
use Psr\Http\Message\ResponseInterface;
use Carbon\Carbon; 
use Carbon\CarbonTimeZone;
use App;

class FirmaIOClient
{
    private $httpClient;
    private $baseUrl;

    public function __construct()
    {
       
        if (App::environment(['local','testing']) && !config('firmaio.subscription_key')) { 
            //mock
            $json = ContrattiData::getCreateDossierResponse();

            // Http::fake([
            //     // Stub a JSON response for GitHub endpoints...
            //     'https://api.io.pagopa.it/api/v1/sign/dossiers' => Http::response($json, 200, ['Content-Type' => 'application/json']),
            //     'https://api.io.pagopa.it/api/v1/sign/signers' => Http::response('{ "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV" }', 200, ['Content-Type' => 'application/json']),
            //     'https://api.io.pagopa.it/api/v1/sign/signature-requests' => Http::response(ContrattiData::getSignatureRequestResponseDRAFT(), 200,  ['Content-Type' => 'application/json']),
            //     'https://api.io.pagopa.it/api/v1/sign/signature-requests/01ARZ3NDEKTSV4RRFFQ69G5FAV' => Http::response(ContrattiData::getSignatureRequestResponseREADY(), 200,  ['Content-Type' => 'application/json']),
            //     'https://api.io.pagopa.it/api/v1/sign/validate-document' => Http::response(ContrattiData::getValidateDocument(), 200, ['Content-Type' => 'application/json']),
            // ]);
        }

        $this->httpClient = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),
        ]);

        $this->baseUrl = config('firmaio.url');

    }

    //Dossier

    public function createDossier($title = "Contratto di Insegnamento")
    {        
        $response = $this->httpClient->post($this->baseUrl . '/dossiers', [
            "title"=>$title,
            //"support_email"=>"demo@example.com",
            "documents_metadata" => [
                [
                    "title"=> "Contratto",
                    "signature_fields"=> []
                ],
            ]
        ]);

        return $response;
    }

    public function getDossier($id)
    {
            $response =$this->httpClient->get($this->baseUrl . '/dossiers/' . $id);
            return $response;
    }

    public function getRequestsByDossier($id, $continuationToken = null, $limit = null)
    {
        $queryParams = [
            'continuationToken' => $continuationToken,
            'limit' => $limit,
        ];

        $response = $this->httpClient->get($this->baseUrl . '/dossiers/' . $id . '/signature-requests', [
            'query' => $queryParams,
        ]);

        return $response;
    }

    //Signer
    public function getSigner($fiscal_code)
    {
        $response = $this->httpClient->post($this->baseUrl . '/signers', [
            "fiscal_code"=>$fiscal_code,
        ]);        
        return $response;
    }


    //getSignature Request
    public function getSignatureRequest($signatureRequestId)    
    {                            
        $response =  $response = $this->httpClient->get($this->baseUrl ."/signature-requests/{$signatureRequestId}");
        return $response;
    }

    //Signature Request
    public function createSignatureRequest($signer_id, $attrs, $dossier_id)    
    {                            
        $gg = config('firmaio.giorni_scadenza');       
        
        $tz = CarbonTimeZone::create(config('unidem.timezone'));

        $dt = Carbon::now();
        $dt->setTimezone('UTC');
        $dt->addDays($gg);
        $expiresDateTime = $dt->setTimezone(config('unidem.timezone'));        

        $response = $this->httpClient->post($this->baseUrl . '/signature-requests', [
            "dossier_id" => $dossier_id, //config('firmaio.dossier_id'),         
            "signer_id"=> $signer_id,  
            "expires_at"=> $expiresDateTime->toIso8601String(),           
            //"support_email"=>"demo@example.com",
            "documents_metadata" => [
                [
                    "title" => "Firma Contratto",
                    "signature_fields"=> [ //array
                        [
                            "attrs" => $attrs,                        
                            "clause"=> [
                                "title" => "Firma contratto",
                                "type" => "REQUIRED"
                            ]
                        ]
                    ]
                ],
            ]
        ]);

        return $response;
    }

    public function uploadURL($signatureRequestId, $documentId)    
    {                            
        // Send a GET request to retrieve the upload URL
        $response = $this->httpClient->get($this->baseUrl ."/signature-requests/{$signatureRequestId}/documents/{$documentId}/upload_url");

        return $response;
    }

    public function upload($uploadUrl, $fileContent) {

        // Invia una richiesta PUT all'URL di upload
        $response = Http::withHeaders([            
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),
            'x-ms-blob-type' => 'BlockBlob',
            'Content-Type' => 'application/pdf', 
        ])->withBody(
            $fileContent, 'application/pdf'
        )->put($uploadUrl); 

        return $response;

    }

    public function download($downloadUrl) {

        $response = Http::withHeaders([            
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),          
            'Content-Type' => 'application/pdf', 
        ])->get($downloadUrl); 

        return $response;

    }


    public function pubblicazioneRichiesta($signatureRequestId){
        //Una volta pubblicata la richiesta di firma, non sarà più possibile modificarla né modificare i documenti allegati.
        //pubblicazione richiesta
        $response = Http::withHeaders([            
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),
        ])->put($this->baseUrl ."/signature-requests/{$signatureRequestId}/status",'READY');

        return $response;

    }

    public function cancellazioneRichiesta($signatureRequestId){
        //Una volta pubblicata la richiesta di firma, non sarà più possibile modificarla né modificare i documenti allegati.
        //pubblicazione richiesta
        $response = Http::withHeaders([            
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),
        ])->put($this->baseUrl ."/signature-requests/{$signatureRequestId}/status",'CANCELLED');

        return $response;

    }

    public function sendNotification($signatureRequestId){
        //Una volta pubblicata la richiesta di firma, non sarà più possibile modificarla né modificare i documenti allegati.
        //pubblicazione richiesta
        $response = Http::withHeaders([            
            'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),
        ])->put($this->baseUrl ."/signature-requests/{$signatureRequestId}/notification");

        return $response;

    }
    

    
    /**
     * validateDocument Tipo di ritorno GUZZLE
     *
     * @param  mixed $fileContent
     * @param  mixed $attrs
     * @return ResponseInterface
     */
    public function validateDocument($fileContent, $attrs): ResponseInterface
    {      
          
        // Prepare the request data
        $fieldContent = [[                                    
                    "clause"=> [
                        "title" => "Firma contratto",
                        "type" => "REQUIRED"
                    ],
                    "attrs" => $attrs,      
        ]];

        //creazione della chiamata multipart
        $boundary = 'my_boundary';
        $multipart_form = [
            [               
                'Content-Disposition' => 'form-data',
                'Content-Type' => 'application/pdf',
                'filename' => 'contratto.pdf',
                'name' => 'document',
                'contents' => $fileContent                                     
            ],
            [
                'Content-Disposition' => 'form-data',
                'Content-Type' => 'application/json',
                'filename' => 'fields.json',
                'name' => 'fields',
                'contents' => json_encode($fieldContent)  
            ]
        ];
        $multipartStream = new MultipartStreamFirmaIO($multipart_form);
       
        $params = [
            'headers' => [
                'Ocp-Apim-Subscription-Key' => config('firmaio.subscription_key'),     
                'Content-Type' => 'multipart/form-data; boundary='.$multipartStream->getBoundary()
            ],
            'body' => $multipartStream          
        ];

        $client = new Client(['base_uri' => $this->baseUrl ]);
        $request = new Request('POST', '/api/v1/sign/validate-document', $params['headers'], $params['body']);   
        Log::info(Message::bodySummary($request)); 
        try {
            $response = $client->send($request);
            //$response =  $client->request('POST','/api/v1/sign/validate-document', $params);
        } catch (ClientException $e) {          
            Log::info(Message::toString($e->getRequest()));
            Log::info(Message::toString($e->getResponse()));     
            //ritorno la response in errore
            return $e->getResponse();                                           
        }
        Log::info(Message::bodySummary($response));         
        return $response;
      
    }

}