<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D4_fiscali;
use App\Service\PrecontrattualeService;
use Auth;

class D4_FiscaliController extends Controller
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
        
            $queryBuilder = Precontrattuale::withoutGlobalScopes()->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('d1_inps', function($join) {
                $join->on('d1_inps.id', '=', 'precontr.d1_inps_id');
            })
            ->where('precontr.insegn_id', $id);
            $datiPrecontrattuale = $queryBuilder->first(
                ['users.id AS userid',
                 'users.nome',
                 'users.cognome',
                 'precontr.*',
                 'p1_insegnamento.insegnamento',
                 'p1_insegnamento.aa',
                 'p1_insegnamento.data_ini_contr',
                 'p1_insegnamento.data_fine_contr',
                 'a1_anagrafica.sesso',
                 'a1_anagrafica.provincia_fiscale',
                 'd1_inps.flag_misura_ridotta'
                 ]);
            
            $copy = D4_fiscali::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiFiscali = [];
        $message = '';     

        $data = $request->except('id', '_method');
        $entity = new D4_fiscali();
        $entity->fill($data['entity']);
        $success = $entity->save();                                         

        $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
        $precontr->d4fiscali()->associate($entity);      
        $precontr->save();
        
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.4: Compilazione modello Richiesta ai fini fiscali', 
            $data['insegn_id'])
        ); 

        $datiFiscali = $entity;

        return compact('datiFiscali', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiFiscali = [];
        $message = '';
      
            $datiFiscali = D4_fiscali::leftJoin('precontr', function($join) {
                $join->on('precontr.d4_fiscali_id', '=', 'd4_fiscali.id');
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
            ->leftJoin('d1_inps', function($join) {
                $join->on('d1_inps.id', '=', 'precontr.d1_inps_id');
            })
            ->leftJoin('d6_detraz_fam_carico', function($join) {
                $join->on('d6_detraz_fam_carico.id', '=', 'precontr.d6_detraz_fam_carico_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('d4_fiscali.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd4_fiscali.*',                                                          
                                                'd4_fiscali.created_at AS submitDate',
                                                'precontr.*',
                                                'p1_insegnamento.insegnamento',
                                                'p1_insegnamento.aa',
                                                'p1_insegnamento.data_ini_contr',
                                                'p1_insegnamento.data_fine_contr',
                                                'p2_natura_rapporto.flag_rapp_studio_univ',
                                                'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                'p2_natura_rapporto.flag_titolare_pensione',
                                                'p2_natura_rapporto.natura_rapporto',
                                                'a1_anagrafica.sesso',
                                                'a1_anagrafica.provincia_residenza',
                                                'a1_anagrafica.provincia_fiscale',
                                                'd1_inps.flag_misura_ridotta',
                                                'd6_detraz_fam_carico.flag_richiesta_detrazioni']);
            
            $pre = Precontrattuale::with(['validazioni'])->where('d4_fiscali_id', $id)->first();                                                        
            $datiFiscali['validazioni'] = $pre->validazioni;

            $success = true;
       
        return compact('datiFiscali', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('d4_fiscali_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiFiscali = [];
        $message = '';
        
            $dati = D4_fiscali::findOrFail($id);
            $postData = $request->except('id', '_method');
            $success = $dati->update($postData);
            $datiFiscali = $dati;
            
            $precontr  = $dati->precontrattuale()->first();            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.4: Modifica dati modello Richiesta ai fini fiscali', 
                $precontr->insegn_id)
            );

        
        return compact('datiFiscali', 'message', 'success');
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
