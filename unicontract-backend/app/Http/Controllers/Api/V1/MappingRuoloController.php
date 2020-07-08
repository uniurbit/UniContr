<?php

namespace App\Http\Controllers\Api\V1;

use App\MappingRuolo;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MappingRuoloController extends Controller
{
    public function index()
    {
        return MappingRuolo::all();
    }
 
    public function show($id)
    {
        $entity = MappingRuolo::with([
            'role:id,name',
            'unitaorganizzativa'])->find($id);
                
        return $entity;
    }

    public function store(Request $request)
    {        
        $this->validate($request, [
            'unitaorganizzativa_uo'=>'required|max:20',
            'descrizione_uo' =>'required',
            'role_id'=>'required',            
            ]
        );

        $tp = MappingRuolo::create($request->all());

        return response()->json($tp, 201);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'unitaorganizzativa_uo'=>'required|max:20',
            'descrizione_uo' =>'required',
            'role_id'=>'required',  
            ]
        );
        
        $tp = MappingRuolo::findOrFail($id);
        $tp->update($request->all());

        return $tp;
    }

    public function delete(Request $request, $id)
    {
        //se è utilizzato non si può cancellare
        $tp = MappingRuolo::findOrFail($id);
        $tp->delete();

        return $tp;
    }
    
    public function query(Request $request){ 
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'role';
        $findparam =new \App\FindParameter($parameters);

        $queryBuilder = new QueryBuilder(new MappingRuolo, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       

        //costruzione della query
    }
}