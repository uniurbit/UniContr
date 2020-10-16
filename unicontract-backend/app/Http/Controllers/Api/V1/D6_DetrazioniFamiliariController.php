<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D6_detrazioni_familiari;
use App\Repositories\D6_FamiliariRepository;
use App\Service\PrecontrattualeService;
use Auth;
class D6_DetrazioniFamiliariController extends Controller
{

    /**
     * @var D6_FamiliariRepository
     */
    private $repo;
    public function __construct(D6_FamiliariRepository $repo){
        $this->repo = $repo;
    }

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
            ->leftJoin('d4_fiscali', function($join) {
                $join->on('d4_fiscali.id', '=', 'precontr.d4_fiscali_id');
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
                 'd4_fiscali.flag_detrazioni',
                 'a1_anagrafica.provincia_fiscale',
                 ]);

            $copy = D6_detrazioni_familiari::with(['familiari'])->whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiFamiliari = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiFamiliari = $this->repo->store($postData);     
        
        $precontr  = $datiFamiliari->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.6: Compilazione modello Richiesta detrazioni fiscali per familiari a carico', 
            $precontr->insegn_id)
        );  

        return compact('datiFamiliari', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiFamiliari = [];
        $message = '';
      
            $datiFamiliari = D6_detrazioni_familiari::leftJoin('precontr', function($join) {
                $join->on('precontr.d6_detraz_fam_carico_id', '=', 'd6_detraz_fam_carico.id');
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
            ->leftJoin('d4_fiscali', function($join) {
                $join->on('d4_fiscali.id', '=', 'precontr.d4_fiscali_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('d6_detraz_fam_carico.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd6_detraz_fam_carico.*',                                                          
                                                'd6_detraz_fam_carico.created_at AS submitDate',
                                                'precontr.*',
                                                'table_validation.flag_submit',
                                                'p1_insegnamento.insegnamento',
                                                'p1_insegnamento.aa',
                                                'p2_natura_rapporto.flag_rapp_studio_univ',
                                                'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                'p2_natura_rapporto.flag_titolare_pensione',
                                                'p2_natura_rapporto.natura_rapporto',
                                                'a1_anagrafica.sesso',
                                                'd4_fiscali.flag_detrazioni']);

            $d6rel = D6_detrazioni_familiari::with(['familiari'])->where('id',$id)->first();
            $datiFamiliari['familiari'] = $d6rel->familiari;

            $pre = Precontrattuale::with(['validazioni'])->where('d6_detraz_fam_carico_id', $id)->first();                                                        
            $datiFamiliari['validazioni'] = $pre->validazioni;

            $success = true;
     
        return compact('datiFamiliari', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('d6_detraz_fam_carico_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiFamiliari = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiFamiliari = $this->repo->updateFamiliare($postData, $id);  
        
        $precontr  = $datiFamiliari->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.6: Modifica dati Richiesta detrazioni fiscali per familiari a carico', 
            $precontr->insegn_id)
        );  

        return compact('datiFamiliari', 'message', 'success');
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
