<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D3_tributari;
use App\Repositories\D3TributariRepository;
use App\Service\PrecontrattualeService;
use Auth;

class D3_TributariController extends Controller
{
//B1ConflittoInteressiRepository

    /**
     * @var D3TributariRepository
     */
    private $repo;
    public function __construct(D3TributariRepository $repo){
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

            $copy = D3_tributari::with(['enti'])->whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $request->validate([
            'entity' => 'required',
            'insegn_id' => 'required',
        ]);
        
        $datiTributari = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiTributari = $this->repo->store($postData);   
                
        $precontr  = $datiTributari->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.3: Compilazione modello Dichiarazione ai fini tributari', 
            $precontr->insegn_id)
        );  

        return compact('datiTributari', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiTributari = [];
        $message = '';
       
            $datiTributari = D3_tributari::leftJoin('precontr', function($join) {
                $join->on('precontr.d3_tributari_id', '=', 'd3_tributari.id');
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
            ->where('d3_tributari.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd3_tributari.*',                                                          
                                                'd3_tributari.created_at AS submitDate',
                                                'precontr.*',
                                                'p1_insegnamento.insegnamento',
                                                'p1_insegnamento.aa',
                                                'p2_natura_rapporto.flag_rapp_studio_univ',
                                                'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                'p2_natura_rapporto.flag_titolare_pensione',
                                                'p2_natura_rapporto.natura_rapporto',
                                                'a1_anagrafica.provincia_residenza',
                                                'a1_anagrafica.sesso']);

            $d3rel = D3_tributari::with(['enti'])->where('id',$id)->first();
            $datiTributari['enti'] = $d3rel->enti;
            
            $pre = Precontrattuale::with(['validazioni'])->where('d3_tributari_id', $id)->first();                                                        
            $datiTributari['validazioni'] = $pre->validazioni;

            $success = true;
        
        return compact('datiTributari', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('d3_tributari_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        $datiTributari = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiTributari = $this->repo->updateTributari($postData, $id); 
        
        $precontr  = $datiTributari->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.3: Modifica dati modello Dichiarazione ai fini tributari', 
            $precontr->insegn_id)
        );  

        return compact('datiTributari', 'message', 'success');
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
