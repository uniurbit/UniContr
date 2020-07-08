<?php

namespace App\Http\Middleware;

use Closure;
use App\Precontrattuale;

class StoreUdatePrecontrattuale
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
        $pre = Precontrattuale::where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        return $next($request);
    }
}
