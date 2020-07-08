<?php

namespace App\Http\Controllers\Api\V1;

use App\Role;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class RoleController extends Controller
{
    public function index()
    {
        return Role::all();
    }
 
    public function show($id)
    {
        return Role::with(['permissions'])->where('id', $id)->first();
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name'=>'required|unique:roles|max:30',
            'permissions' =>'required',
            ]
        );

        $role = Role::create(['name' => $request->name]);
        if($request->permissions <> ''){
            $role->syncPermissions(
                collect($request->permissions)
                ->map(function ($item) {
                    return $item['name'];
                })                               
            );           
        }              
        return $role;
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($request->id);

        $this->validate($request, [
            'name'=>'required|max:30|unique:roles,name,'.$id,
            'permissions' =>'required',
        ]);

        $input = $request->except(['permissions']);
        Log::info('Role fill [' . implode( ", ", $input ) . ']');       

        $role->fill($input)->save();
        if($request->permissions <> ''){
            $permissions = collect($request->permissions)
                ->map(function ($item) {
                    return $item['name'];
                });
            $role->syncPermissions($permissions);                      
        }

        return $role;
    }

    public function delete(Request $request, $id)
    {
        //se è utilizzato non si può cancellare
        $role = Role::findOrFail($id);
        $role->delete();

        return $role;
    }
    
    public function query(Request $request){ 
        
        $app = $request->json();
        $parameters = $request->json()->all();
        $findparam =new \App\FindParameter($parameters);    

        $queryBuilder = new QueryBuilder(new Role, $request);
                
        return $queryBuilder->build()->paginate();       

        //costruzione della query
    }
}