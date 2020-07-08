<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Docente;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $exist = true;
        $count = 0;
        $ins = Docente::where('v_ie_ru_personale_id_ab', $request->input('v_ie_ru_personale_id_ab'))->get();
        $count = $ins->count();

        if($count === 0) { 
            $datiDocente = [];
            $message = '';
          
                $docente = new Docente();
                $postData = $request->except('id', '_method');
                $docente->fill($postData);
                $success = $docente->save();
                $datiDocente = $docente;
           
            return compact('datiDocente', 'message', 'success');      
        } else {
            return compact('exist');
        } 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id_ab)
    {
        $docente = [];
        $message = '';
     
            $docente = Docente::where('v_ie_ru_personale_id_ab', $id_ab)->get();
            $success = true;
        
        return compact('docente', 'message', 'success');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
