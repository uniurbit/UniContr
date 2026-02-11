<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\User;
use App\Http\Controllers\Controller;

use App\Role;
use App\Permission;
use Illuminate\Support\Facades\Log;
use App\Service\LogActivityService;
use Hash;
use Exception;
use DB;
use App\Http\Controllers\FirmaUSIGNClient;

class FirmaUSIGNController extends Controller
{

    public function __construct() {
       $this->client = new FirmaUSIGNClient();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $token
     * @return \Illuminate\Http\Response
     */
    public function sendToFEA(Request $request, $token)
    {
        $response = $this->client->sendToFEA($token);
        if ($response->successful()){
            return $response->json(); 
        }
        return $this->createErrorResponse('Errore.');
        
    }

    public function otpType(Request $request, $token)
    {
        $response = $this->client->otpType($token);
        if ($response->successful()){
            return $response->json(); 
        }
        return response(['error' => true], $response->status());
        
    }
    //firma/sendOtp
    public function sendOtp(Request $request, $token)
    {
        $response = $this->client->sendOtp($token);
        if ($response->successful()){
            return $response->json(); 
        }

        return response($response->json(), $response->status());
        
    }
    
    public function signProcess(Request $request, $token)
    {
        $response = $this->client->signProcess($token, $request->all());
        if ($response->successful()){
            return $response->json(); 
        }

        return response($response->json(), $response->status());
        
    }

    // Funzione per creare una risposta di errore
    private function createErrorResponse($message)
    {
        return [
            'success' => false,
            'message' => $message,
            'data' => [],
        ];
    }

    // Funzione per creare una risposta di successo
    private function createSuccessResponse($message, $data)
    {
        return [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];
    }
}