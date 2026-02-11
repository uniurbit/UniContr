<?php

namespace App\Http\Middleware;

use Closure;

class Cors
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
        $response = $next($request);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:4200');
        $response->headers->set("Access-Control-Expose-Headers", "Access-Control-*");                    
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Access-Control-*, X-Custom-Header, Content-Type, Accept, X-Auth-Token, Authorization, X-Requested-With, x-refresh, Application');    
        $response->headers->set('Access-Control-Allow-Credentials',' true');                      
        return $response;
    }
}
