<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\B4RapportoPA;
use App\Repositories\B4RapportoPARepository;
use App\Service\PrecontrattualeService;
use Auth;

class B4RapportoPAController extends Controller
{

     /**
     * @var B4RapportoPARepository
     */
    private $repo;
    public function __construct(B4RapportoPARepository $repo){
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
       
            $datiPrecontrattuale = PrecontrattualeService::getDatiIntestazione($id);
            
            //cercare l'ultima precontrattuale inserita stato = 0 o stato = 1 docente_id            
            //with(['attachments'])->
            $copy = B4RapportoPA::with(['pubblamm'])->whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
                $query->where('docente_id',$datiPrecontrattuale['docente_id'])->where('stato','<',2);
            })->orderBy('id','desc')->first();
            $copy['attachments'] = [];
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

        $datiRappPA = [];
        $message = '';
        $success = true;
        $postData = $request->except('id', '_method');
        $datiRappPA = $this->repo->store($postData);            
      
        return compact('datiRappPA', 'message', 'success');
    }
    

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        
        $datiRapportoPA = [];
        $message = '';
     
            $datiRapportoPA = B4RapportoPA::leftJoin('precontr', function($join) {
                $join->on('precontr.b4_rapp_pubbl_amm_id', '=', 'b4_rapp_pubbl_amm.id');
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
            ->where('b4_rapp_pubbl_amm.id', $id)->first(['users.nome',
                                                          'users.cognome', 
                                                          'b4_rapp_pubbl_amm.*',                                                          
                                                          'b4_rapp_pubbl_amm.created_at AS submitDate',
                                                          'precontr.*',
                                                          'p1_insegnamento.insegnamento',
                                                          'p1_insegnamento.aa',
                                                          'p2_natura_rapporto.flag_rapp_studio_univ',
                                                          'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                          'p2_natura_rapporto.flag_titolare_pensione',
                                                          'p2_natura_rapporto.natura_rapporto',
                                                          'a1_anagrafica.sesso',
                                                          'a1_anagrafica.provincia_residenza']);

            $b4rel = B4RapportoPA::with(['pubblamm'])->where('id',$id)->first();
            $datiRapportoPA['pubblamm'] = $b4rel->pubblamm;
            
            $datiRapportoPA['attachments'] = B4RapportoPA::where('id','=', $id)->first()->attachments()->get();  

            $pre = Precontrattuale::with(['validazioni'])->where('b4_rapp_pubbl_amm_id', $id)->first();                                                        
            $datiRapportoPA['validazioni'] = $pre->validazioni;

            $success = true;
       
        return compact('datiRapportoPA', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('b4_rapp_pubbl_amm_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }  

        $datiRapportoPA = [];
        $message = '';
        $success = true;
        $postData = $request->except('id', '_method');
        $datiRapportoPA = $this->repo->updateRapp($postData, $id);            
      
        return compact('datiRapportoPA', 'message', 'success'); 
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
