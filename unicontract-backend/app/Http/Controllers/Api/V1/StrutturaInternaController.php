<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\StrutturaInterna;
use App\Models\PersonaInterna;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SoapControllerTitulusAcl;
use App\Service\QueryTitulusBuilder;

class StrutturaInternaController extends Controller
{

    protected $sc;

    public function __construct() {
        $this->sc = new SoapControllerTitulusAcl();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {        
	        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }


    public function getminimal($id){
        $findparam = new \App\FindParameter([
            'rules' => [
                [
                    'field' => 'struint_coduff',
                    'operator' => '=',
                    'value' => $id
                ],
            ],
            'limit' => 1,
        ]);          

        $queryBuilder = new QueryTitulusBuilder(new StrutturaInterna, null, $this->sc, $findparam);

        return $queryBuilder->build()->get()->first();
        //return $queryBuilder->build()->get()[0];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {        
        //la load utilizza il physdoc o nrecord
        //va tradotta la risposta 
        $result = $this->sc->load($id);

        $objResult = simplexml_load_string($result);
        $model = new StrutturaInterna;
    
        $arr= QueryTitulusBuilder::xmlToArray($objResult->Document->struttura_interna, []);
        $model->fill($arr);

        return $model;
    }
    
    public function query(Request $request){
       
        $queryBuilder = new QueryTitulusBuilder(new StrutturaInterna, $request, $this->sc);

        return $queryBuilder->build()->paginate();               
    }        
    

    public function getResponsabile($nomeUff){

        $result = $this->sc->lookup($nomeUff,null);
        $obj = simplexml_load_string($result);                       

        $personaInterna = new PersonaInterna;
        $arr = QueryTitulusBuilder::xmlToArray($obj->struttura_interna, []);        
        $personaInterna->fill($arr['persona_interna']);

        return $personaInterna;
    }

}
