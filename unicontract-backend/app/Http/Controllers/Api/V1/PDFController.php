<?php

namespace App\Http\Controllers\Api\V1;
use View;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PDFController extends Controller
{    
    public function getHeader(Request $request) 
    {
        $query = $request->all();
        return view('contratto.header', compact('query'));
    }
}