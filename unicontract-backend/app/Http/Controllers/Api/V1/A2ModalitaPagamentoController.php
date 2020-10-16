<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ModalitaPagamentoUgov;
use App\Models\A2ModalitaPagamento;
use App\Models\AnagraficaUgov;
use App\Precontrattuale;
use App\Repositories\A2ModalitaPagamentoRepository;
use App\Service\PrecontrattualeService;
use App\Audit;
use Illuminate\Support\Facades\Log;
use Auth;
class A2ModalitaPagamentoController extends Controller
{

    //A2ModalitaPagamentoRepository

    /**
     * @var A2ModalitaPagamentoRepository
     */
    private $repo;
    public function __construct(A2ModalitaPagamentoRepository $repo){
        $this->repo = $repo;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

        $datiPagamento = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiPagamento = $this->repo->store($postData);      
        return compact('datiPagamento', 'message', 'success'); 
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id_ab)
    {
        $dati = [];
        $message = '';
        
            $dati = AnagraficaUgov::leftJoin('PAGAMENTI', function($join) {
                $join->on('PAGAMENTI.MATRICOLA', '=', 'ANAGRAFICA.MATRICOLA')
                ->orderBy('PAGAMENTI.DATA_IN', 'DESC');
            })
            ->leftJoin('BANCHE', function($join) {
                $join->on('PAGAMENTI.ABI', '=', 'BANCHE.ABI');
            })
            ->where('ANAGRAFICA.ID_AB', $id_ab)
            ->first(['PAGAMENTI.*', 'ANAGRAFICA.NOME', 'ANAGRAFICA.COGNOME', 'BANCHE.DESCR']);

            //cercare l'ultima precontrattuale inserita stato = 0 o stato = 1 docente_id
            $copy = A2ModalitaPagamento::whereHas('precontrattuale', function ($query) use($id_ab) {
                $query->where('docente_id',$id_ab)->where('stato','<',2);
            })->orderBy('id','desc')->first();

            $dati['copy'] = $copy;          


            $success = true;
       
        return compact('dati', 'message', 'success');
    }

    public function showlocal($id)
    {
        $dati = [];
        $message = '';
       
            $dati = A2ModalitaPagamento::leftJoin('precontr', function($join) {
                $join->on('precontr.a2_mod_pagamento_id', '=', 'a2_mod_pagamento.id');
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
            ->where('a2_mod_pagamento.id', $id)->first(['users.nome',
                                                        'users.cognome',
                                                        'a1_anagrafica.provincia_residenza',
                                                        'a1_anagrafica.provincia_fiscale',
                                                        'a2_mod_pagamento.*',
                                                        'a2_mod_pagamento.created_at AS createdDate',
                                                        'precontr.*',
                                                        'p1_insegnamento.insegnamento',
                                                        'p1_insegnamento.aa',
                                                        'p2_natura_rapporto.flag_rapp_studio_univ',
                                                        'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                        'p2_natura_rapporto.flag_titolare_pensione',
                                                        'p2_natura_rapporto.natura_rapporto']);
            
            $pre = Precontrattuale::with(['validazioni'])->where('a2_mod_pagamento_id', $id)->first();   
            if ($pre){
                $dati['validazioni'] = $pre->validazioni;
            }else{
                $dati['validazioni'] = [];
            }                                                     
            
              
            $success = true;
       
        return compact('dati', 'message', 'success');
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

        $data = [];
        $message = '';

        if (Precontrattuale::with(['validazioni'])->where('a2_mod_pagamento_id', $id)->first()->isBlockedAmministrativa()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }    
        
        $pagamento = A2ModalitaPagamento::findOrFail($id);          
        $original = $pagamento->getOriginal();  
        $postData = $request->except('id', '_method');
        $success = $pagamento->update($postData);

        $toTrace =null;
        if (!$pagamento->wasRecentlyCreated) {                     
            $toTrace = array_only($pagamento->getChanges(),Audit::$toTrace);
            foreach ($toTrace  as $key => $value) {
                //dati da memorizzare ... 
                //e notificare ...
                if (in_array($key,Audit::$toTrace)){
                    $audit = new Audit();
                    $audit->field_name = $key;
                    $audit->old_value = $original[$key] ?: '';
                    $audit->new_value = $value;
                    $pagamento->audit()->save($audit);
                    Log::info('Variazione ['. $key .']');

                    $mgs = 'da '. $audit->old_value.' a '.$audit->new_value = $value;
                    
                }  

            }
            
          
        }

        $precontr  =  $pagamento->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello A.2: Modifica dati modello modalità di pagamento', 
            $precontr->insegn_id)
        );

        if (count($toTrace)>0){                        

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello A.2: Variazione codice IBAN', 
                $precontr->insegn_id)
            );  
        }         


        $data = $pagamento;
        
        return compact('data', 'message', 'success');
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
