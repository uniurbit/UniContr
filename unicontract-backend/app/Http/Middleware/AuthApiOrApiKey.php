<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use Illuminate\Support\Facades\Request as RequestFacade;

class AuthApiOrApiKey
{

    //  // Define the trusted domains and IPs here
    // protected $trustedDomains = [
    //     'unidem.uniurb.it',
    //     'unidem-preprod.uniurb.it',    
    // ];

    // protected $trustedIps = [
    //     '127.0.0.1', // Localhost IP        
    // ];

    public function handle(Request $request, Closure $next)
    {

        // Check for a Bearer token (JWT) and validate it with 'auth:api'
        if ($request->bearerToken()) {
            if (Auth::guard('api')->check()) {
                return $next($request); // Proceed if JWT is valid
            }
            return response()->json(['error' => 'Unauthorized: Invalid JWT'], 401);
        }

        $trustedDomains = config('trusted.domains',[]);
        $trustedIps = config('trusted.ips',[]);
        $configuredApiKey = config('trusted.api_key');

        // Get the client's IP address
        $clientIp = $request->ip();
        $hostname = gethostbyaddr($clientIp);

        // Check if the client's IP is trusted or if the hostname matches a trusted domain
        if (!in_array($clientIp, $trustedIps) && !in_array($hostname, $trustedDomains)) {
            return response()->json(['error' => 'Unauthorized: IP or domain not allowed'], 403);
        }

        $apiKeyHeader  = $request->header('X-API-Key');              

        // Extract user information from the API key
        // Assuming the API key format is 'api_key:user_id_ab'
        [$providedApiKey, $userIdAb] = explode(':', $apiKeyHeader ) + [null, null]; // Safely handle missing values

        // Validate API key without user information
        if ($providedApiKey !== $configuredApiKey) {
            return response()->json(['error' => 'Unauthorized: Invalid API Key'], 401);
        }

        $userToAuthenticate = null;
        // If user_id_ab is provided, attempt to find the user
        if ($userIdAb) {
            $userToAuthenticate = User::where('v_ie_ru_personale_id_ab', $userIdAb)->first();
            // Check if the provided userIdAb is in email format
            if (!$userToAuthenticate) {
                if (filter_var($userIdAb, FILTER_VALIDATE_EMAIL)) {
                    $userToAuthenticate = User::where('email', $userIdAb)->first();
                }
            }
            //$userToAuthenticate = User::where('cf', $userCf)->first();
            // Check if user exists
            if (!$userToAuthenticate) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } else {
            return response()->json(['error' => 'User identifier not provided'], 400);
        }         

        // Optionally, set the authenticated user
        Auth::login($userToAuthenticate);

        return $next($request);
        
    }
}
