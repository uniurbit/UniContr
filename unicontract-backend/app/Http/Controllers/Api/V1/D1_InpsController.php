<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\Models\D1_Inps;
use App\Repositories\D1_InpsRepository;
use App\Service\PrecontrattualeService;
use Auth;

class D1_InpsController extends Controller
{

    /**
     * @var D1_InpsRepository
     */
    private $repo;
    public function __construct(D1_InpsRepository $repo){
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

            $copy = D1_Inps::whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
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

        $datiInps = [];
        $message = '';
      
        $dati = new D1_Inps();
        $postData = $request->except('id', '_method');
        $dati->fill($postData);
        $success = $dati->save();
        $datiInps = $dati;

        $precontr  = $dati->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello D.1: Compilazione modello Dichiarazione ai fini previdenziali', 
            $precontr->insegn_id)
        );   
      
        return compact('datiInps', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiInps = [];
        $message = '';
      
            $datiInps = D1_Inps::leftJoin('precontr', function($join) {
                $join->on('precontr.d1_inps_id', '=', 'd1_inps.id');
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
            ->where('d1_inps.id', $id)->first(['users.nome',
                                                'users.cognome', 
                                                'd1_inps.*',                                                          
                                                'd1_inps.created_at AS submitDate',
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

            $datiInps['attachments'] = D1_Inps::where('id','=', $id)->first()->attachments()->get();  
            
            $pre = Precontrattuale::with(['validazioni'])->where('d1_inps_id', $id)->first();                                                        
            $datiInps['validazioni'] = $pre->validazioni;

            $success = true;
      
        return compact('datiInps', 'message', 'success');
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

        if (Precontrattuale::with(['validazioni'])->where('d1_inps_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }  

        $datiInps = [];
        $message = '';          
        $success = true;
        $postData = $request->except('id', '_method');
        $datiInps = $this->repo->updateD1_Inps($postData, $id); 
        
        $precontr  = $datiInps->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.1: Modifica dati modello Dichiarazione ai fini previdenziali', 
                $precontr->insegn_id)
            ); 

        return compact('datiInps', 'message', 'success');
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
