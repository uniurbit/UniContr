<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\PersonaInterna;
use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SoapControllerTitulusAcl;
use App\Service\QueryTitulusBuilder;

class PersonaInternaController extends Controller
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
                    'field' => 'persint_matricola',
                    'operator' => '=',
                    'value' => $id
                ],
            ],
            'limit' => 1,
        ]);  

        $queryBuilder = new QueryTitulusBuilder(new PersonaInterna, null, $this->sc, $findparam);

        return $queryBuilder->build()->get()->first();        
    }
     
    
    public function getminimalByName($nomcogn){

        $findparam = new \App\FindParameter([
            'rules' => [
                [
                    'field' => 'persint_nomcogn',
                    'operator' => '=',
                    'value' => $nomcogn
                ],
            ],
            'limit' => 1,
        ]);  

        $queryBuilder = new QueryTitulusBuilder(new PersonaInterna, null, $this->sc, $findparam);

        return $queryBuilder->build()->get()->first();        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return  Azienda::find($id);
    }
    


    public function query(Request $request){
       
        $queryBuilder = new QueryTitulusBuilder(new PersonaInterna, $request, $this->sc);

        return $queryBuilder->build()->paginate();               
    }        

}
