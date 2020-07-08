<?php

namespace App\Http\Middleware;

use Closure;

class CheckBlocked
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
        if (auth()->check()) 
        {
            if (date(config('unidem.date_format')) <= auth()->user()->blocked_date) {  
                abort(403, trans('global.utente_non_autorizzato'));   
            }            
        }      
        return $next($request);   
    } 
    
}
