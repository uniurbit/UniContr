<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Notifica;
use App\Http\Controllers\Controller;

use App\Role;
use App\Permission;
use Illuminate\Support\Facades\Log;
use App\Service\LogActivityService;
use Hash;
use Exception;
use DB;

class NotificaController extends Controller
{

    public function __construct() {

    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {        

        if (!Auth::user()->hasRole('super-admin')){
            abort(403, trans('global.utente_non_autorizzato'));  
        }
        
        $id = $request->get('id');
        $query = $request->all();

        if ($id == null){            
            return Notifica::all(); 
        }
        $notifica = Notifica::where('id', $id)->first();
        return $notifica;		        
    }

   
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       
        if (!Auth::user()->hasRole('super-admin')){
            abort(403, trans('global.utente_non_autorizzato'));  
        }
        
        $this->validate($request, [
            'messaggio'=>'required',           
            'data_fine' => 'required',                    
        ]);
    
        DB::beginTransaction(); 
        $notifica = new Notifica();  

        try {                             
            $notifica->fill($request->all());       
            $notifica->user_id = Auth::user()->id;                  
            $notifica->save();                         
        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit(); 
        return Notifica::findOrFail($notifica->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $notifica = Notifica::where('id', $id)->first();
        return $notifica;
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
        
        if (!Auth::user()->hasRole('super-admin')){
            abort(403, trans('global.utente_non_autorizzato'));  
        }
        
        $notifica = Notifica::findOrFail($id); 

        //Validate name, email and password fields  
        $this->validate($request, [
            'messaggio'=>'required',           
            'data_fine' => 'required',            
        ]);

        $notifica->user_id = Auth::user()->id;                  
        $notifica->fill($request->all())->save();

        return Notifica::findOrFail($id);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        
        if (!Auth::user()->hasRole('super-admin')){
            abort(403, trans('global.utente_non_autorizzato'));  
        }
        
        //Find a user with a given id and delete
        $notifica = Notifica::findOrFail($id); 
        $notifica->delete();
 
        return response()->json(null, 204);
    }

    public function query(Request $request){
        
        // if (!Auth::user()->hasRole('super-admin')){
        //     abort(403, trans('global.utente_non_autorizzato'));  
        // }
        
        $app = $request->json();
        $parameters = $request->json()->all();  
        $findparam =new \App\FindParameter($parameters);      
   
        $queryBuilder = new QueryBuilder(new Notifica, $request, $findparam);
                        
        return $queryBuilder->build()->paginate();     
    }

}
