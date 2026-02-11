<?php

namespace App\Http\Middleware;
use OneLogin\Saml2;
use Illuminate\Support\Facades\URL;
use Closure;

class SamlAuth
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
        if(\Auth::guest())
        {
            if ($request->ajax())
            {
                return response('Unauthorized.', 401);
            }
            else
            {
                return \Saml2::login(URL::full());
                //return redirect()->guest('login');
            }
        }

        return $next($request);
    }
}
