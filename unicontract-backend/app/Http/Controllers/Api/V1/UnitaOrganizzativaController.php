<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\UnitaOrganizzativa;
use App\Http\Controllers\Controller;

class UnitaOrganizzativaController extends Controller
{

    public function index()
    {
        return UnitaOrganizzativa::all();
    }
 
    public function show($id)
    {        
        return UnitaOrganizzativa::find($id);
    }

    public function getminimal($id)
    {        
        return UnitaOrganizzativa::where('uo',$id)->first();
    }

    public function store(Request $request)
    {
      
    }

    public function update(Request $request, $id)
    {
      
    }

    public function delete(Request $request, $id)
    {
        
    }
    
    public function query(Request $request){
         
        $parameters = $request->all();
        $parameters['order_by'] = 'id_ab,desc';

        //convertire le date per il formato query 
        $findparam =new \App\FindParameter($parameters);  

        foreach ($findparam->rules as $rule) {
            if ($rule->field == 'data_fin'){
                $rule->value = Carbon::createFromFormat(config('unidem.date_format'), $rule->value)->format('Y-m-d');
            }
        }
        
        $queryBuilder = new QueryBuilder(new UnitaOrganizzativa, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       

    }

}
