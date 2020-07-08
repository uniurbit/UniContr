<?php

namespace App\Http\Middleware;

use Closure;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LogRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $content = $request->getContent();
        $content = (strlen($content) > 100) ? substr($content,0,100) : $content;
        $user =  (Auth::user() ? Auth::user()->id.' '.Auth::user()->name : '');

        $dataToLog  = 'IP Address: ' . $request->ip() . "\r\n";
        $dataToLog .= 'URL: '    . $request->fullUrl()  . "\r\n";
        $dataToLog .= 'Method: ' . $request->method() . "\r\n";
        $dataToLog .= 'Agent: ' .  $request->userAgent() . "\r\n";   
        $dataToLog .= 'Header: ' . $request->headers;   
        $dataToLog .= 'Input: '  . $content . "\r\n";
        //$dataToLog .= ' Output: ' . $response->getContent();
        $dataToLog .= 'UserId: ' . $user;
        Log::info('Dump all request '.$dataToLog);     

        return $next($request);
    }
}
