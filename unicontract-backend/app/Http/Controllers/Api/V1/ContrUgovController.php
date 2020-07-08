<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\InsegnamUgov;
use App\Models\Ugov\ContrUgov;
use App\Precontrattuale;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Exports\ContrUgovExport;
class ContrUgovController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $anno)
    {            
    }

    public function show($coper_id)
    {        
    }


    public function export(Request $request){
        //prendi i parametri 
        $response = $this->queryparameter($request);
        $findparam = $response["findparam"];
        $precontrs = $response["precontrs"];
                
        return (new ContrUgovExport($request,$findparam, $precontrs))->download('daticontabili.csv', \Maatwebsite\Excel\Excel::CSV,  [
            'Content-Type' => 'text/csv',
        ]);        
    }

    public function queryparameter(Request $request){   
        //ID_SIADI non nullo tutti i contratti sono di tipo  CONTRATTO_A_PERSONALE
        //ANNO_REF indica l'anno di riferimento 

        $app = $request->json();
        $parameters = $request->json()->all();
        $parameters['includes'] = 'insegnamento,user,validazioni,p2naturarapporto'; 
        //distinguere i parametri di ricerca
        //per precontrattuale
        //per contrUgov            
        
        //parametri di ricerca per precontrattuale
        $keytoremove = null;
        $collection = collect($parameters['rules']);   
          
        $parameters['rules'] = $collection->filter(function ($value, $key) use (&$keytoremove){
            return array_key_exists('type',$value) ? $value['type'] != 'selectrelation' : true;                               
        })->all();

        //aggiungiamo un filtro di default sull'anno
        $ruleanno = $collection->first(function ($value, $key) {
            return $value['field'] == 'insegnamento.aa';
        });

        //SE NON C'E' AGGIUNGERE FILTRO ANNO CORRENTE SEMPRE  
        if ($ruleanno==null){
            array_push($parameters['rules'],[
                "operator" => "=",
                "field" => "insegnamento.aa",                
                "value" =>  (now()->month <= 10) ? now()->year-1 : now()->year //anno accademico
            ]);
        }

        //ricerca di tutte le precontrattuali  
        $findparam = new \App\FindParameter($parameters);
        $findparam->limit= 3000;
        $findparam->page = 0;
        $queryBuilder = new QueryBuilder(new Precontrattuale, $request, $findparam);                        
        $precontrs = $queryBuilder->build()->noPagination();  
        
        $parametersUgov['rules'] = $collection->filter(function ($value, $key) use (&$keytoremove){
            return array_key_exists('type',$value) ? $value['type'] == 'selectrelation' : false;                                     
        })->all();
        
        //creazione parametri di ricerca su ContrUGOV 
        //determinazione dei coper_id interessati
        $coper_ids = $precontrs ? $precontrs->pluck('insegnamento.coper_id')->toArray() : [];
        array_push($parametersUgov['rules'],[
            "operator" => "In",
            "field" => "ID_SIADI",                
            "value" => $coper_ids
        ]);           

        $parametersUgov['includes'] = 'compensi,compensi.ordinativi';       
        $parametersUgov['limit'] = $parameters['limit'];
        if (isset($parameters['page'])) {
            $parametersUgov['page'] = $parameters['page'];
        }else{
            $parametersUgov['page'] = null;
        }
        
        $parametersUgov['order_by'] = 'id_dg,desc';
       
        $findparam =new \App\FindParameter($parametersUgov);    
        return compact('findparam', 'precontrs'); //$findparam;
     }


    public function query(Request $request){
      
        $response = $this->queryparameter($request);
        $findparam = $response["findparam"];
        $precontrs = $response["precontrs"];

        $queryBuilder = new QueryBuilderForceInsensitive(new ContrUgov, $request, $findparam);
                
        $results =  $queryBuilder->build()->paginate();               
        foreach ($results as $result) {
            $pre = $precontrs->first(function ($value, $key) use($result) {
                return $value->insegnamento->coper_id == $result->id_siadi;
            });            
            $result['precontr'] = $pre;            
        }
        return $results;
    }        
  

}
