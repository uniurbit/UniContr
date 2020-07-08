<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\B3RapportiStudio;
use App\Repositories\B3RapportoUnivRepository;
use App\Service\PrecontrattualeService;
use Auth;

class B3RappStudioUniversController extends Controller
{

    /**
     * @var B3RapportoUnivRepository
     */
    private $repo;
    public function __construct(B3RapportoUnivRepository $repo){
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
            $copy = B3RapportiStudio::with(['rapporti'])->whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiRappStudio = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiRappStudio = $this->repo->store($postData);      
        return compact('datiRappStudio', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiRapporto = [];
        $message = '';
      
            $datiRapporto = B3RapportiStudio::leftJoin('precontr', function($join) {
                $join->on('precontr.b3_rapp_studio_univ_id', '=', 'b3_rapp_studio_univ.id');
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
            ->where('b3_rapp_studio_univ.id', $id)->first(['users.nome',
                                                          'users.cognome', 
                                                          'a1_anagrafica.provincia_residenza',
                                                          'b3_rapp_studio_univ.flag_rapporto_universita',                                                          
                                                          'b3_rapp_studio_univ.created_at AS submitDate',
                                                          'precontr.*',
                                                          'p1_insegnamento.insegnamento',
                                                          'p1_insegnamento.aa',
                                                          'p2_natura_rapporto.natura_rapporto',
                                                          'p2_natura_rapporto.flag_rapp_studio_univ',
                                                          'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                          'p2_natura_rapporto.flag_titolare_pensione']);

            $b3rel = B3RapportiStudio::with(['rapporti'])->where('id',$id)->first();
            $datiRapporto['rapporti'] = $b3rel->rapporti;

            $pre = Precontrattuale::with(['validazioni'])->where('b3_rapp_studio_univ_id', $id)->first();                                                        
            $datiRapporto['validazioni'] = $pre->validazioni;

            $success = true;
      
        return compact('datiRapporto', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('b3_rapp_studio_univ_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiRappStudio = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiRappStudio = $this->repo->updateRapporto($postData, $id);      
        return compact('datiRappStudio', 'message', 'success');
        
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
