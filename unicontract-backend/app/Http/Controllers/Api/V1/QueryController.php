<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\User;
use App\Http\Controllers\Controller;

//Importing laravel-permission models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class QueryrController extends Controller
{

    public function __construct() {
       
     }
 
     /**
      * Display a listing of the resource.
      *
      * @return \Illuminate\Http\Response
      */
     public function query(Request $request)
     {        
         $id = $request->get('userId');
         $query = $request->all();
 
         if ($id == null){            
             return User::all(); 
         }
         $user = User::with(['roles'])->where('id', $id)->first();
         return $user;		        
     }

}