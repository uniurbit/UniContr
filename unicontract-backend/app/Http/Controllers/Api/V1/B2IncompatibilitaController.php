<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\B2Incompatibilita;
use Auth;

class B2IncompatibilitaController extends Controller
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
       
            $queryBuilder = Precontrattuale::leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->where('precontr.insegn_id', $id);
            $datiPrecontrattuale = $queryBuilder->first(
                ['users.id AS userid',
                 'users.nome',
                 'users.cognome',
                 'precontr.*',
                 'p1_insegnamento.insegnamento',
                 'p1_insegnamento.aa'
                 ]);
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

        $datiIncompatib = [];
        $message = '';
      
            $incompatib = new B2Incompatibilita();
            $postData = $request->except('id', '_method');
            $incompatib->fill($postData);
            $success = $incompatib->save();
            $datiIncompatib = $incompatib;
       
        return compact('datiIncompatib', 'message', 'success'); 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiIncompatib = [];
        $message = '';
        
            $datiIncompatib = B2Incompatibilita::leftJoin('precontr', function($join) {
                $join->on('precontr.b2_incompatibilita_id', '=', 'b2_incompatibilita.id');
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
            ->where('b2_incompatibilita.id', $id)->first(['users.nome',
                                                          'users.cognome', 
                                                          'a1_anagrafica.provincia_residenza',
                                                          'b2_incompatibilita.*',
                                                          'b2_incompatibilita.created_at AS submitDate',
                                                          'precontr.*',
                                                          'p1_insegnamento.insegnamento',
                                                          'p1_insegnamento.aa',
                                                          'p2_natura_rapporto.natura_rapporto',
                                                          'p2_natura_rapporto.flag_rapp_studio_univ',
                                                          'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                          'p2_natura_rapporto.flag_titolare_pensione']);

            $pre = Precontrattuale::with(['validazioni'])->where('b2_incompatibilita_id', $id)->first();                                                        
            $datiIncompatib['validazioni'] = $pre->validazioni;
                                                                    
            $success = true;
      
        return compact('datiIncompatib', 'message', 'success');
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
        $datiIncompatib = [];
        $message = '';

        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        if (Precontrattuale::with(['validazioni'])->where('b2_incompatibilita_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }  


            $incompatib = B2Incompatibilita::findOrFail($id);            
            $postData = $request->except('id', '_method');
            $success = $incompatib->update($postData);
            $datiIncompatib = $incompatib;
        
        return compact('datiIncompatib', 'message', 'success');
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
