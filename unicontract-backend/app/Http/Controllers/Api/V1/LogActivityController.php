<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Service\LogActivityService;
use App\LogActivity;

use Exception;

class LogActivityController extends Controller
{
    public function index()
    {
        return LogActivityService::logActivityLists();
    }
     
    public function show($id)
    {
        return LogActivity::find($id);
    }

    public function query(Request $request){ 
        $parameters = $request->all();
        $parameters['order_by'] = 'created_at,desc';

        //convertire le date per il formato query 
        $findparam =new \App\FindParameter($parameters);  

        $queryBuilder = new QueryBuilder(new LogActivity, $request, $findparam);
                
        return $queryBuilder->build()->paginate();       

    }

}