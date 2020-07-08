<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Precontrattuale;
use App\Models\EmailList;
use App\SendEmail;
use App\Service\PrecontrattualeService;

class SendEmailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $emailList = [];
        $message = '';

            $pre = Precontrattuale::with('sendemails','sendemails.user')->where('insegn_id',$id)->first();            
            $emailList = $pre->sendemails;
            $success = true;
    
        return compact('emailList', 'message', 'success');
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
        $datiEmail = [];
        $message = '';
     
            $dati = new EmailList();
            $postData = $request->except('id', '_method');
            $dati->fill($postData);
            $dati->sender_user_id = Auth::user()->id;
            $dati->model_type = 'App\\Precontrattuale';
            $dati->oggetto = 'Richiesta modifica/integrazioni modulistica precontrattuale';
            $success = $dati->save();
            $datiEmail = $dati;
     
        return compact('datiEmail', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiPrecontrattuale = [];
        $message = '';
            
            $datiPrecontrattuale = PrecontrattualeService::getDatiIntestazione($id);

            $pre = Precontrattuale::with('sendemails','sendemails.user')->where('insegn_id',$id)->first();            
            $datiPrecontrattuale['emailList'] = $pre->sendemails;            

            $success = true;
       
        return compact('datiPrecontrattuale', 'message', 'success');
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
