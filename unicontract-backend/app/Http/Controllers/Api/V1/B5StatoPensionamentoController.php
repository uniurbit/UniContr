<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\B5StatoPensionamento;
use App\Service\PrecontrattualeService;
use Auth;

class B5StatoPensionamentoController extends Controller
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
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
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
                 'a1_anagrafica.sesso',
                 'p2_natura_rapporto.natura_rapporto',
                 ]);
                 
            $copy = B5StatoPensionamento::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiStatoPensionam = [];
        $message = '';        

        $data = $request->except('id', '_method');
        $entity = new B5StatoPensionamento();
        $entity->fill($data['entity']);
        $success = $entity->save();                                         

        $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
        $precontr->b5statopensionamento()->associate($entity);      
        $precontr->save();
        
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello B.5: Compilazione dati Stato di pensionamento', 
            $data['insegn_id'])
        ); 

        $datiStatoPensionam = $entity;
        
        return compact('datiStatoPensionam', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiStatoPensionam = [];
        $message = '';
        
            $datiStatoPensionam = B5StatoPensionamento::leftJoin('precontr', function($join) {
                $join->on('precontr.b5_stato_pensionam_id', '=', 'b5_stato_pensionam.id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('b5_stato_pensionam.id', $id)->first(['users.nome',
                                                          'users.cognome', 
                                                          'b5_stato_pensionam.*',                                                          
                                                          'b5_stato_pensionam.created_at AS submitDate',
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

            $pre = Precontrattuale::with(['validazioni'])->where('b5_stato_pensionam_id', $id)->first();                                                        
            $datiStatoPensionam['validazioni'] = $pre->validazioni;

            $success = true;
       
        return compact('datiStatoPensionam', 'message', 'success');
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

        $datiStatoPensionam = [];
        $message = '';

        if (Precontrattuale::with(['validazioni'])->where('b5_stato_pensionam_id', $id)->first()->isBlockedAmministrativa()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }  

            $pensionam = B5StatoPensionamento::findOrFail($id);            
            $postData = $request->except('id', '_method');
            $success = $pensionam->update($postData);
            $datiStatoPensionam = $pensionam;

            $precontr  =  $pensionam->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.5: Modifica dati Stato di pensionamento', 
                $precontr->insegn_id)
            );  

        return compact('datiStatoPensionam', 'message', 'success');
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
