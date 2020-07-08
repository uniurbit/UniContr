<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\InsegnamUgov;
use App\Precontrattuale;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Auth;
class InsegnamUgovController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $anno)
    {      
        $queryBuilder = InsegnamUgov::orderBy('COGNOME', 'ASC')->orderBy('NOME', 'ASC')->orderBy('COPER_ID', 'ASC')
            ->where([
                ['AA_OFF_ID', '=', $anno],
                ['RUOLO_DOC_COD', '<>', 'PA'],
                ['RUOLO_DOC_COD', '<>', 'PO'],
                ['RUOLO_DOC_COD', '<>', 'RU'],
                ['MOTIVO_ATTO_COD', '<>', null]
            ]);
        $insegn = $queryBuilder->get();
        return response()->json([
            'lista' => $insegn,
            'success' => true
        ]);
    }

    public function show($coper_id)
    {
        $datiUgov = [];
        $message = '';

        $datiUgov = InsegnamUgov::join('ANAGRAFICA', 'V_IE_DI_COPER.MATRICOLA', '=', 'ANAGRAFICA.MATRICOLA')
            ->where('V_IE_DI_COPER.COPER_ID', $coper_id)            
            ->first(['ANAGRAFICA.ID_AB', 'ANAGRAFICA.EMAIL', 'ANAGRAFICA.E_MAIL', 'ANAGRAFICA.E_MAIL_PRIVATA', 'V_IE_DI_COPER.*']);            
                   
        $datiUgov['contatore_insegnamenti'] = InsegnamUgovController::contatoreInsegnamenti($coper_id);
        
        $success = true;
        return compact('datiUgov', 'message', 'success');
    }

    //condizione necessaria che il contratto corrente si CONF_INC 
    public static function contatoreInsegnamenti($coper_id) {
     
        $datiUgov = DB::connection('oracle')->table('V_IE_DI_COPER V1')->join('V_IE_DI_COPER V2', function($join) use($coper_id) {
            $join->on('V2.AF_GEN_COD', '=', 'V1.AF_GEN_COD')
                 ->on('V2.cod_fis','=','V1.cod_fis')
                 ->on('V2.data_ini_contratto','<','V1.data_ini_contratto');
        })
        ->where('V2.motivo_atto_cod','=','BAN_INC')  
        ->where('V1.COPER_ID','=', $coper_id)->where('V1.motivo_atto_cod','=','CONF_INC')     
        ->select('V2.data_ini_contratto as ultima_nuova_attribuzione','V1.data_ini_contratto as data_contratto_corrente')
        ->orderBy('V2.data_ini_contratto', 'DESC')->first();            

        if ($datiUgov){            
            $count = DB::connection('oracle')->table('V_IE_DI_COPER V1')->join('V_IE_DI_COPER V2', function($join) use($coper_id){
                $join->on('V2.AF_GEN_COD', '=', 'V1.AF_GEN_COD')
                     ->on('V2.cod_fis','=','V1.cod_fis');                           
            })->where('V1.COPER_ID','=',$coper_id)->where('V2.data_ini_contratto','<',$datiUgov->data_contratto_corrente)
            ->where('V2.data_ini_contratto','>=',$datiUgov->ultima_nuova_attribuzione)->count();
        }else{
            //NON c'è il BAN_INC conto tutti i contratti CONF_INC PRESENTI escludendo il presente
            $count = DB::connection('oracle')->table('V_IE_DI_COPER V1')->join('V_IE_DI_COPER V2', function($join) use($coper_id){
                $join->on('V2.AF_GEN_COD', '=', 'V1.AF_GEN_COD')
                     ->on('V2.cod_fis','=','V1.cod_fis')     
                     ->on('V2.data_ini_contratto','<','V1.data_ini_contratto');                         
            })->where('V1.COPER_ID','=',$coper_id)->where('V2.motivo_atto_cod','=','CONF_INC')->count();    
            return $count;
        }
        
        return $count;
    }

    public function query(Request $request){

        $app = $request->json();
        $parameters = $request->json()->all();
        $parameters['order_by'] = 'cognome,ASC|nome,ASC';
        array_push($parameters['rules'],[
            "operator" => "NotIn",
            "field" => "RUOLO_DOC_COD",                
            "value" => ['PA','PO','RU']
        ]);
        array_push($parameters['rules'],[
            "operator" => "!=",
            "field" => "matricola",                
            "value" => '[null]'
        ]);
       
        array_push($parameters['rules'],[
            "operator" => "!=",
            "field" => "DATA_INI_CONTRATTO",                
            "value" => '[null]'
        ]);


        //Ricercare tutte le precontrattuali dell'anno di ricerca
        $collection = collect($parameters['rules']);

        //filtrare gli insegnamenti già importati
        $rule = $collection->first(function ($value, $key) {
            return $value['field'] == 'AA_OFF_ID';
        });

        if ($rule){
            $precontrs = Precontrattuale::with('insegnamento')->whereHas('insegnamento',function($query) use($rule){
                $query->where('aa', (int)$rule['value']);
                $query->select('aa','coper_id','id'); 
            })->where('stato','<',2)->get();
        
        }else{
            $precontrs = Precontrattuale::with(['insegnamento'])->where('stato','<',2)->get();
        }

        if ($precontrs){
            $coper_ids = $precontrs->pluck('insegnamento.coper_id')->toArray();
            array_push($parameters['rules'],[
                "operator" => "NotIn",
                "field" => "COPER_ID",                
                "value" => $coper_ids
            ]);
        }   
        

        // se l'utente NON ha il permesso di ricerca su tutti i contratti
        if (!Auth::user()->hasPermissionTo('search all insegnamenti')){           
          
            //aggiungere filtro per unitaorganizzativa_uo
            $uo = Auth::user()->unitaorganizzativa();

            if ($uo == null) {
                abort(403, trans('global.utente_non_autorizzato'));
            }    
    
            if ($uo->isPlesso()){
                //filtro per unitaorganizzativa dell'utente di inserimento (plesso)
                array_push($parameters['rules'],[
                    "operator" => "In",
                    "field" => "dip_cod",                
                    "value" => $uo->dipartimenti()
                ]);
            } else {
                //ad un afferente al dipartimento filtro per dipartimento                                
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "dip_cod",                
                    "value" => $uo->uo
                ]);
            }

        }


        $findparam =new \App\FindParameter($parameters);      

        $queryBuilder = new QueryBuilderForceInsensitive(new InsegnamUgov, $request, $findparam);
                
        return $queryBuilder->build()->paginate();               
    }        
  

}
