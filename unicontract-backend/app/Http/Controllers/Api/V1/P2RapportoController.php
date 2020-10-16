<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\P2rapporto;
use App\Repositories\P2RapportoRepository;
use App\Precontrattuale;
use App\Service\PrecontrattualeService;
use Auth;

class P2RapportoController extends Controller
{

    

       /**
     * @var P2RapportoRepository
     */
    private $repo;
    public function __construct(P2RapportoRepository $repo){
        $this->repo = $repo;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {      
        $rapporto = P2rapporto::get();
        return response()->json([
            'dati' => $rapporto,
            'success' => true
        ]);
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

        $data = [];
        $message = '';        
        $success = true;
        $postData = $request->except('id', '_method');             
        $data = $this->repo->store($postData);                    
        return compact('data', 'message', 'success');      
    }

    public function show($id)
    {
        $datiRapporto = [];
        $message = '';
        
            $queryBuilder = P2rapporto::leftJoin('precontr', function($join) {
                $join->on('precontr.p2_natura_rapporto_id', '=', 'p2_natura_rapporto.id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('p2_natura_rapporto.id', $id);
            $datiRapporto = $queryBuilder->first(['users.v_ie_ru_personale_id_ab AS userid',
                                                  'users.nome',
                                                  'users.cognome',
                                                  'p2_natura_rapporto.id AS p2id',
                                                  'p2_natura_rapporto.*',
                                                  'p2_natura_rapporto.created_at AS createdDate',
                                                  'p1_insegnamento.*',
                                                  'a1_anagrafica.provincia_residenza',
                                                  'a1_anagrafica.provincia_fiscale',
                                                  'precontr.*']);
            
            $pre = Precontrattuale::with(['validazioni'])->where('p2_natura_rapporto_id', $id)->first();                                                        
            $datiRapporto['validazioni'] = $pre->validazioni;

            $success = true;
  
        return compact('datiRapporto', 'message', 'success');
    }

    /**
     * Update the specific resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        if (Precontrattuale::with(['validazioni'])->where('p2_natura_rapporto_id', $id)->first()->isBlockedAmministrativa()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }  

        
        $data = [];
        $message = '';

        $rapporto = P2rapporto::findOrFail($id);            
        $postData = $request->except('id', '_method');
        $success = $rapporto->update($postData['entity']);
        $data = $rapporto;

        //memorizzare story process
        $precontr  =  $rapporto->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello P.2: Aggiornamento dati Rapporto del collaboratore', 
            $postData['insegn_id'])
        ); 


        return compact('data', 'message', 'success');
    }
}
