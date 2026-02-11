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
        $accessGranted = false;
    
        // Proceed only if $id is present
        if ($id) {
            $user = Auth::user();
            
            // Check if the user has the 'search all contratti' permission
            if ($user->hasPermissionTo('search all contratti')) {
                $accessGranted = true; // Permission is granted for all contracts
            } else {
                // Fetch the Precontrattuale record
                $pre = Precontrattuale::withoutGlobalScopes()->with(['user', 'insegnamento'])->where('insegn_id', $id)->first();
    
                // Handle access based on user roles
                if ($user->hasRole('op_docente') && ($pre->user->v_ie_ru_personale_id_ab == $user->v_ie_ru_personale_id_ab)) {
                    // Access granted only if the user IDs match
                    $accessGranted = true;
                } else {
                    // Additional check for organizational unit
                    $uo = $user->unitaorganizzativa();
    
                    if ($uo == null) {
                        abort(403, trans('global.utente_non_autorizzato'));
                    }
    
                    if ($uo->isPlesso()) {
                        // Check if the teaching department is part of the user's departments
                        if (in_array($pre->insegnamento->dip_cod, $uo->dipartimenti())) {
                            $accessGranted = true;
                        }
                    } else {
                        // Check if the teaching department matches the user's unit
                        if ($pre->insegnamento->dip_cod == $uo->uo) {
                            $accessGranted = true;
                        }
                    }
                }
            }
            
            // Deny access if not granted
            if (!$accessGranted) {
                abort(403, trans('global.utente_non_autorizzato'));
            }
        }
        
        return $next($request);
    }
    
}
