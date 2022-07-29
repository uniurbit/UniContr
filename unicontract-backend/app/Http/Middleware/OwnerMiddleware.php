<?php

namespace App\Http\Middleware;
use App\Precontrattuale;
use Auth;
use Closure;

class OwnerMiddleware
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
        $id = $request->route('id');
        if ($id){         
            // se l'utente NON ha il permesso di ricerca su tutti i contratti verifico se può eseguire il download
            if (!Auth::user()->hasPermissionTo('search all contratti')){           
                $pre = Precontrattuale::withoutGlobalScopes()->with(['user','insegnamento'])->where('insegn_id', $id)->first();
                if (Auth::user()->hasRole('op_docente')){
                    if ($pre->user->v_ie_ru_personale_id_ab != Auth::user()->v_ie_ru_personale_id_ab){
                        abort(403, trans('global.utente_non_autorizzato'));
                    }                
                }else{
                    //aggiungere filtro per unitaorganizzativa_uo
                    $uo = Auth::user()->unitaorganizzativa();
    
                    if ($uo == null) {
                        abort(403, trans('global.utente_non_autorizzato'));
                    }    
    
                    if ($uo->isPlesso()){
                        if (!(in_array($pre->insegnamento->dip_cod,$uo->dipartimenti()))){
                            abort(403, trans('global.utente_non_autorizzato'));
                        }    
                        
                    } else {
                        if ($pre->insegnamento->dip_cod != $uo->uo){
                            abort(403, trans('global.utente_non_autorizzato'));
                        }                   
                    }     
                }                  
            }
        }
        return $next($request);
    }
}
