<?php
namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Service\LogActivityService;

class LogAfterRequest {
    public function handle($request, \Closure $next)
    {
        return $next($request);
    }
    public function terminate($request, $response)
    {
        $dataToLog  = ' IP Address: ' . $request->ip();
        $dataToLog .= ' URL: '    . $request->fullUrl();
        $dataToLog .= ' Method: ' . $request->method();
        $dataToLog .= ' Agent: ' .  $request->userAgent();      
        $dataToLog .= ' Input: '  . $request->getContent();
        //$dataToLog .= ' Output: ' . $response->getContent();
        $dataToLog .= ' UserId: ' .  (Auth::user() ? Auth::user()->id.' '.Auth::user()->name : '');
        Log::info('Dump request '.$dataToLog);     

        LogActivityService::addToLog('log');

    }
}