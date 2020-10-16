<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D5_fiscali_estero;
use App\Service\PrecontrattualeService;
use Auth;

class D5_FiscaliEsteroController extends Controller
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
                 ]);

            $copy = D5_fiscali_estero::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiFiscaliEstero = [];
        $message = '';        

            $data = $request->except('id', '_method');
            $entity = new D5_fiscali_estero();
            $entity->fill($data['entity']);
            $success = $entity->save();                                         
    
            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->d5fiscaliestero()->associate($entity);      
            $precontr->save();
            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.5: Compilazione modello Dichiarazione ai fini fiscali per i residenti all\'estero', 
                $data['insegn_id'])
            ); 
    
            $datiFiscaliEstero = $entity;

        return compact('datiFiscaliEstero', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiFiscaliEstero = [];
        $message = '';
      
            $datiFiscaliEstero = D5_fiscali_estero::leftJoin('precontr', function($join) {
                $join->on('precontr.d5_fiscali_resid_estero_id', '=', 'd5_fiscali_resid_estero.id');
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
            ->where('d5_fiscali_resid_estero.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd5_fiscali_resid_estero.*',                                                          
                                                'd5_fiscali_resid_estero.created_at AS submitDate',
                                                'precontr.*',
                                                'p1_insegnamento.insegnamento',
                                                'p1_insegnamento.aa',
                                                'p2_natura_rapporto.flag_rapp_studio_univ',
                                                'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                'p2_natura_rapporto.flag_titolare_pensione',
                                                'p2_natura_rapporto.natura_rapporto',
                                                'a1_anagrafica.provincia_residenza',
                                                'a1_anagrafica.provincia_fiscale',
                                                'a1_anagrafica.sesso']);

            $pre = Precontrattuale::with(['validazioni'])->where('d5_fiscali_resid_estero_id', $id)->first();                                                        
            $datiFiscaliEstero['validazioni'] = $pre->validazioni;

            $success = true;
        
        return compact('datiFiscaliEstero', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('d5_fiscali_resid_estero_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiFiscaliEstero = [];
        $message = '';
       
            $dati = D5_fiscali_estero::findOrFail($id);
            $postData = $request->except('id', '_method');
            $success = $dati->update($postData);
            $datiFiscaliEstero = $dati;

            $precontr  = $dati->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.5: Modifica dati modello Dichiarazione ai fini fiscali per i residenti estero', 
                $precontr->insegn_id)
            );  

        return compact('datiFiscaliEstero', 'message', 'success');
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
