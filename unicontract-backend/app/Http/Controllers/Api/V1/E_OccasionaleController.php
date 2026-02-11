<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\E_AutonomoOccasionale;
use App\Service\PrecontrattualeService;
use Auth;

class E_OccasionaleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $datiPrecontrattuale = [];
        $message = '';
     
            $datiPrecontrattuale = PrecontrattualeService::getDatiIntestazione($id);
            
            $copy = E_AutonomoOccasionale::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
                $query->where('docente_id',$datiPrecontrattuale['docente_id'])->where('stato','<',2);
            })->orderBy('id','desc')->first();            
            $datiPrecontrattuale['copy'] = $copy;
            
            $success = true;
    
        return compact('datiPrecontrattuale', 'message', 'success');
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
        
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $datiModelloE = [];
        $message = '';
    
            $dati = new E_AutonomoOccasionale();
            $postData = $request->except('id', '_method');
            $dati->fill($postData);
            $success = $dati->save();
            $datiModelloE = $dati;
       
        return compact('datiModelloE', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiModelloE = [];
        $message = '';
        
            $datiModelloE = E_AutonomoOccasionale::leftJoin('precontr', function($join) {
                $join->on('precontr.e_autonomo_occasionale_id', '=', 'e_autonomo_occasion.id');
            })
            ->leftJoin('table_validation', function($join) {
                $join->on('table_validation.insegn_id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('e_autonomo_occasion.id', $id)->first(['users.nome',
                                                          'users.cognome', 
                                                          'e_autonomo_occasion.*',                                                          
                                                          'e_autonomo_occasion.created_at AS submitDate',
                                                          'precontr.*',
                                                          'table_validation.flag_submit',
                                                          'p1_insegnamento.insegnamento',
                                                          'p1_insegnamento.aa',
                                                          'p2_natura_rapporto.flag_rapp_studio_univ',
                                                          'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                          'p2_natura_rapporto.flag_titolare_pensione',
                                                          'p2_natura_rapporto.natura_rapporto',
                                                          'a1_anagrafica.sesso']);

            $pre = Precontrattuale::with(['validazioni'])->where('e_autonomo_occasionale_id', $id)->first();                                                        
            $datiModelloE['validazioni'] = $pre->validazioni;
                                              
            $success = true;
       
        return compact('datiModelloE', 'message', 'success');
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

        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        if (Precontrattuale::with(['validazioni'])->where('e_autonomo_occasionale_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiModelloE = [];
        $message = '';
       
            $dati = E_AutonomoOccasionale::findOrFail($id);
            $postData = $request->except('id', '_method');
            $success = $dati->update($postData);
            $datiModelloE = $dati;

            $precontr  = $dati->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello E: Modifica dati modello Prestazione di Lavoro Autonomo Occasionale', 
                $precontr->insegn_id)
            );  

       
        return compact('datiModelloE', 'message', 'success');
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
