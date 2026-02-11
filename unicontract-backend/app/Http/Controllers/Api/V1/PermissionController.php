<?php

namespace App\Http\Controllers\Api\V1;

use App\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return Permission::all();
    }
 
    public function show($id)
    {
        return Permission::find($id);
    }

    public function store(Request $request)
    {
        return Permission::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->update($request->all());

        return $permission;
    }

    public function delete(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return $permission;
    }
    
    public function query(Request $request){

        $queryBuilder = new QueryBuilder(new Permission, $request);
                
        return $queryBuilder->build()->paginate();       

        //costruzione della query

    }
}