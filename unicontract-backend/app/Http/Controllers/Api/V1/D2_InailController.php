<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D2_Inail;
use App\Service\PrecontrattualeService;
use Auth;

class D2_InailController extends Controller
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
            
            $copy = D2_Inail::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiInail = [];
        $message = '';

            $request->validate([
                'entity' => 'required',
                'insegn_id' => 'required',
            ]);

            $data = $request->except('id', '_method');

            $entity = new D2_Inail();
            $entity->fill($data['entity']);
            $success = $entity->save();
            $datiInail = $entity;

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->d2inail()->associate($entity);      
            $precontr->save();
            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.2: Compilazione modello Dichiarazione ai fini assicurativi INAIL', 
                $precontr->insegn_id)
            );  
       
        return compact('datiInail', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiInail = [];
        $message = '';
      
            $datiInail = D2_Inail::leftJoin('precontr', function($join) {
                $join->on('precontr.d2_inail_id', '=', 'd2_inail.id');
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
            ->where('d2_inail.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd2_inail.*',                                                          
                                                'd2_inail.created_at AS submitDate',
                                                'precontr.*',
                                                'p1_insegnamento.insegnamento',
                                                'p1_insegnamento.aa',
                                                'p2_natura_rapporto.flag_rapp_studio_univ',
                                                'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                'p2_natura_rapporto.flag_titolare_pensione',
                                                'p2_natura_rapporto.natura_rapporto',
                                                'a1_anagrafica.provincia_residenza',
                                                'a1_anagrafica.sesso']);

            $pre = Precontrattuale::with(['validazioni'])->where('d2_inail_id', $id)->first();                                                        
            $datiInail['validazioni'] = $pre->validazioni;

            $success = true;
      
        return compact('datiInail', 'message', 'success');
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
        if (Precontrattuale::with(['validazioni'])->where('d2_inail_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiInail = [];
        $message = '';
    
            $dati = D2_Inail::findOrFail($id);
            $postData = $request->except('id', '_method');
            $success = $dati->update($postData);
            $datiInail = $dati;

            $precontr  = $dati->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.2: Modifica dati modello Dichiarazione ai fini assicurativi INAIL', 
                $precontr->insegn_id)
            ); 

        return compact('datiInail', 'message', 'success');
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
