<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Tests\Unit\ContrattiData;
use App;
use Illuminate\Support\Arr;

class FirmaUSIGNClient
{
    //private $httpClient;
    private $baseUrl;



    public function getHttpClient(){
        return Http::withBasicAuth(config('usign.username'), config('usign.password'));
     }

    public function __construct()
    {
       
        //$this->httpClient = Http::withBasicAuth(config('usign.username'), config('usign.password'));

        $this->baseUrl = config('usign.url');

    }


    public function userAuthorization($cf)
    {        
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/users/authorizations/'.$cf);

        return $response;
    }


    //sendToFEA
    public function sendToFEA($token)
    {        
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/sendToFEA/'.$token);

        return $response;
    }

    //** Restituisce lo stato del processo identificato dal token, che può assumere i seguenti valori: active, deleted, success .*/
    // /api/public/process/status/{token} 
    // {
    //     "code": 200,
    //     "rejections": [],
    //     "message": "active",
    //     "status": "active",
    //     "token": "04395C728ECE08155A2883D4416C114E0C6C9E7648E6698AAD3E8AF9135DB73D"
    //   }
     public function processStatus($token)
     {        
         $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/process/status/'.$token);
 
         return $response;
     }

    //** Restituisce lo stato del processo identificato dal token, che può assumere i seguenti valori: Upload, Confirm, Sent-to-user, Otp, Completed .*/
    // /api/public/process/step/{token}

    //** Esempio di risposta */
    // https://uniurb.webfirma.pp.cineca.it:443/my-web-firma/api/public/process/step/04395C728ECE08155A2883D4416C114E0C6C9E7648E6698AAD3E8AF9135DB73D
    // {
    //   "code": "200",
    //   "description": "upload"
    // }
    public function processStep($token)
    {        
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/process/step/'.$token);

        return $response;
    }

    //creazione del processo di firma
    // https://uniurb.webfirma.pp.cineca.it:443/my-web-firma/api/public/createProcess
    // {
    //   "code": 200,
    //   "message": "04395C728ECE08155A2883D4416C114E0C6C9E7648E6698AAD3E8AF9135DB73D"
    // }
    public function createProcess($email, $name, $async = true)
    {        
        // { 
        //     process_name : “nome del processo”,
        //     document_type  : “COD_TYPE_DOC”,
        //     email : “test@mail.com”,
        //     async : true,
        //     assignee_name: "Mario Rossi",
        //     process_description : "eventuali istruzioni o note per l'utente firmatario"
        //   }

        $data = [
            'process_description' => "Firma contratto",
            'process_name' => "Firma contratto",
            'document_type' => 'ALTRO',
            'assignee_name' => $name,
            'email' => $email,
            'async' => $async
        ];

        $response = $this->getHttpClient()->post($this->baseUrl . 'api/public/createProcess', $data);

        return $response;
    }

    //** 
    /* Esempio di richesta di upload
    /* header 
    /* --header 'Content-Type: multipart/form-data' --header 'Accept: application/json' --header 'Authorization: Basic dW5pY29udHIyX3VzaWduX3dzOldpQnkzWkNWQm0qRW1QQFQ=' {"type":"formData"} 
    /*
    /* https://uniurb.webfirma.pp.cineca.it:443/my-web-firma/api/public/upload/04395C728ECE08155A2883D4416C114E0C6C9E7648E6698AAD3E8AF9135DB73D?typeFirma=PADES&isChild=false&flMarcaTemporale=false&isNote=false&signature_page=3&signature_bottom=100&signature_left=200&signature_width=300&signature_height=400
    /* 
        {
        "code": 200,
        "message": 53000
        }
    */

    public function upload($token, $fileContent, $attrs)
    {             
        //typeFirma=PADES&isChild=false&flMarcaTemporale=false&isNote=false&signature_page=3&signature_bottom=100&signature_left=200&signature_width=300&signature_height=400
       // "CADES"|"XADES"|"PADES" "GRAPHIC", "REQUIRED",
        $h_pts = 842;
        $payload = [                      
            'typeFirma' => 'GRAPHIC',
            'isChild' => 'false',
            'flMarcaTemporale' => 'false',
            'isNote' => 'false',
            'signature_page' => $attrs['page'] + 1,
            'signature_bottom' =>  $h_pts - $attrs['coordinates']['y'] - $attrs['size']['h'],
            'signature_left' => $attrs['coordinates']['x'],
            'signature_width' => $attrs['size']['w'],
            'signature_height'=> $attrs['size']['h']
        ];
        
        $query = Arr::query($payload);

        //'file' è obbligatorio
        $request = $this->getHttpClient()->attach('file', $fileContent, 'Contratto.pdf');

        $response = $request->post($this->baseUrl . 'api/public/upload/'.$token.'?'.$query);

        //oggetto di risposta
        //{
        // code: 200
        // message: 54000
        //}      
        
        return $response;
    }

    //called to complete the upload step and to assign the process to the U-Sign user. To assign the process to the user use the value 'sent-to-user', 
    //To consider conclused the upload step and allow user to see the process put 'upload-finished' as value

    public function uploadFinished($token)
    {
        $data= [
            //'step'=> 'upload-finished'
            'step'=> 'sent-to-user'            
        ];

        $response = $this->getHttpClient()->put($this->baseUrl . 'api/public/process/step/'.$token,$data);

        return $response;
    }

    //https://uniurb.webfirma.pp.cineca.it/my-web-firma/api/public/certificato/otpType/091a32b4-6294-4681-9743-536555eff2ff
    public function otpType($token)
    {        
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/certificato/otpType/'.$token);
        //"{"otpType":"TSMS","provider":"cineca infocert"}"
        return $response;
    }

    public function sendOtp($token)
    {        
        $response =  $this->getHttpClient()->withHeaders(['Content-Type' => 'application/json'])->post($this->baseUrl . 'api/public/sendOtp/'.$token,[]);
      
        return $response;
    }

    
    public function signProcess($token, $payload)
    {        
        $query = Arr::query($payload);
        $response =  $this->getHttpClient()->acceptJson()->post($this->baseUrl . 'api/public/signProcess/'.$token.'?'. $query);
        
        return $response;
    }
    

    public function delete($token)
    {                
        $response =  $this->getHttpClient()->delete($this->baseUrl . '/api/public/process/'.$token);
      
        return $response;
    }

    /**
     * link
     *
     * @param  mixed $token
     * @return esempio caso si successo
     * // {
     *   //     code : 200,          
     *   //     message  : "https://cineca.webfirma.cineca.it/my-web-firma/tenant/cineca-it/signRequest/<id>"          
     *   //  }
     */
    public function link($token)
    {        
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/process/link/'.$token);
        
        return $response;
    }

    public function notifyAssignedUser($token)
    {        
        //POST /api/public/process/notifyAssignedUser
        $response = $this->getHttpClient()->post($this->baseUrl . 'api/public/process/notifyAssignedUser', [
            'token' => $token
        ]);
        
        return $response;
    }

    public function userInfo($email)
    {        
        //GET /api/public/users/userInfo/{email}
        $response = $this->getHttpClient()->get($this->baseUrl . 'api/public/users/userInfo/'.$email);
        
        return $response;
    }

    public function downloadSingleFile($token, $fileId)
    {        
        $payload = [                      
            'fileId' =>  $fileId
        ];
        $query = Arr::query($payload);
        //GET /api/public/downloadSingleFile/{token}
        $response = $this->getHttpClient()->get($this->baseUrl . '/api/public/downloadSingleFile/'.$token.'?'. $query);
        
        return $response;
    }


    //ESEMPIO ENRICO 
    // {
    //     "id": 53000,
    //     "username": "enrico.oliva",
    //     "firstName": "Enrico",
    //     "lastName": "Oliva",
    //     "mail": "enrico.oliva@uniurb.it",
    //     "provider": {
    //       "id": 50000,
    //       "name": "cineca infocert",
    //       "description": "cineca inforcert",
    //       "providerDomain": null,
    //       "lastCheck": 1694632032000,
    //       "numCertificates": 2021,
    //       "automaticUpdate": true,
    //       "enabled": 3,
    //       "date-creation": 1634568800000,
    //       "date-last-modified": 1694663917371
    //     },
    //     "tenant": {
    //       "id": 1,
    //       "name": "uniurb",
    //       "description": "Università di Urbino",
    //       "code": "uniurb-it",
    //       "codTenant": "501320"
    //     },
    //     "isDeleted": false,
    //     "certificate": null
    //   }
    
    //ESEMPIO MARCO 
    // {
    //     "id": 50581,
    //     "username": "marco.cappellacci",
    //     "firstName": "Marco",
    //     "lastName": "Cappellacci",
    //     "mail": "marco.cappellacci@uniurb.it",
    //     "provider": {
    //       "id": 50000,
    //       "name": "cineca infocert",
    //       "description": "cineca inforcert",
    //       "providerDomain": null,
    //       "lastCheck": 1694632032000,
    //       "numCertificates": 2021,
    //       "automaticUpdate": true,
    //       "enabled": 3,
    //       "date-creation": 1634568800000,
    //       "date-last-modified": 1694663917371
    //     },
    //     "tenant": {
    //       "id": 1,
    //       "name": "uniurb",
    //       "description": "Università di Urbino",
    //       "code": "uniurb-it",
    //       "codTenant": "501320"
    //     },
    //     "isDeleted": false,
    //     "certificate": {
    //       "id": 1527193,
    //       "aliasCertificato": "CPPMRC87H26L500A_UNIURB",
    //       "dataDiRevoca": null,
    //       "dtInizioVldt": 1676968329000,
    //       "dtFineVldt": 1771981200000,
    //       "tipoOtp": "TSMS",
    //       "status": "VALID"
    //     }
    //   }
      
}