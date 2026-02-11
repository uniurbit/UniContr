<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\User;
use App\PrecontrattualePerGenerazione;
use App\Models\Insegnamenti;
use Auth;
use App\Repositories\PrecontrattualeRepository;
use App\Models\Validazioni;
use App\Service\PrecontrattualeService;
use App\Service\FirmaIOService;
use Carbon\Carbon;
use App\Service\EmailService;
use Illuminate\Support\Str;
use App\Service\TitulusHelper;
use App\Exports\PrecontrattualeExport;
use Illuminate\Support\Facades\Log;
use App\Models\InsegnamUgov;
use PHP_IBAN\IBAN;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Exception;
use Illuminate\Support\Arr;
use App\Http\Controllers\FirmaIOClient;

class PrecontrattualeDocenteController extends PrecontrattualeController
{
    public function __construct(PrecontrattualeRepository $repo)
    {
        parent::__construct($repo);
    }

    // Override the queryParameter method
    public function queryparameter(Request $request){       
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'insegnamento,user,validazioni,p2naturarapporto'; 
    
        // se l'utente NON ha il permesso di ricerca su tutti i contratti
        if (!Auth::user()->hasPermissionTo('search all contratti')){           

            //se ha il ruolo docente e il 
            //e ruolo operatore dipartimentale
            //nel caso multiruolo devo scegliere un ruolo
            if (Auth::user()->hasRole('op_docente')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "user.v_ie_ru_personale_id_ab",                
                    "value" => Auth::user()->v_ie_ru_personale_id_ab
                ]);
            }else {
                abort(403, trans('global.utente_non_autorizzato'));
            }                
        }

        $findparam = new \App\FindParameter($parameters);
        return $findparam;
    }
}
