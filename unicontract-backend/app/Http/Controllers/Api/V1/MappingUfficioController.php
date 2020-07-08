<?php

namespace App\Http\Controllers\Api\V1;

use App\MappingUfficio;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MappingUfficioController extends Controller
{
    public function index()
    {
        return MappingUfficio::all();
    }
 
    public function show($id)
    {
        return MappingUfficio::find($id);
    }

    public function store(Request $request)
    {

        $this->validate($request, [
            'unitaorganizzativa_uo'=>'required|unique:mappinguffici|max:20',
            'descrizione_uo' =>'required',
            'strutturainterna_cod_uff'=>'required|unique:mappinguffici|max:20',
            'descrizione_uff' =>'required',
            ]
        );

        $tp = MappingUfficio::create($request->all());

        return response()->json($tp, 201);
    }

    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'unitaorganizzativa_uo'=>'required|max:20',
            'descrizione_uo' =>'required',
            'strutturainterna_cod_uff'=>'required|max:20',
            'descrizione_uff' =>'required',
            ]
        );
        
        $tp = MappingUfficio::findOrFail($id);
        $tp->update($request->all());

        return $tp;
    }

    public function delete(Request $request, $id)
    {
        //se è utilizzato non si può cancellare
        $tp = MappingUfficio::findOrFail($id);
        $tp->delete();

        return $tp;
    }
    
    public function query(Request $request){ 
        
        $queryBuilder = new QueryBuilder(new MappingUfficio, $request);
                
        return $queryBuilder->build()->paginate();       

        //costruzione della query
    }
}