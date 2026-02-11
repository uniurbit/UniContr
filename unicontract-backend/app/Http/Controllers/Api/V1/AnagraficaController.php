<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AnagraficaUgov;
use App\Models\Anagrafica;
use App\Models\Docente;
use App\Models\RappParentelaUgov;
use App\Repositories\AnagraficaRepository;
use App\User;
use App\Precontrattuale;
use App\Service\PrecontrattualeService;
use App\Audit;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Auth;
class AnagraficaController extends Controller
{
    /**
     * @var AnagraficaRepository
     */
    private $repo;
    public function __construct(AnagraficaRepository $repo){
        $this->repo = $repo;
    }

    public function show($id_ab)
    {
        $dati = [];
        $message = '';
 
            $dati = AnagraficaUgov::leftJoin('FAM_ANAGRAFICA', function($join) {
                $join->on('FAM_ANAGRAFICA.MATRICOLA', '=', 'ANAGRAFICA.MATRICOLA')
                ->where('FAM_ANAGRAFICA.RAP_PARENTELA', '=', 'CG');
            })
            ->leftJoin('ANA_TIT_STUDIO', function($join) {
                $join->on('ANA_TIT_STUDIO.MATRICOLA', '=', 'ANAGRAFICA.MATRICOLA')
                ->whereNotNull('ANA_TIT_STUDIO.UNIV_LAUREA');
            })
            ->leftJoin('COMUNE_PROV', function($join) {
                $join->on('COMUNE_PROV.COD', '=', 'ANAGRAFICA.COMUNE_NASC');
            })
            ->where('ANAGRAFICA.ID_AB', $id_ab)
            ->orderBy('COMUNE_PROV.DATA_IN', 'DESC')
            ->first(['FAM_ANAGRAFICA.RAP_PARENTELA', 'FAM_ANAGRAFICA.COD_FISC AS COD_FISC_CONIUGE', 'ANA_TIT_STUDIO.DESCR AS TITOLO_STUDIO', 'ANAGRAFICA.*', 'COMUNE_PROV.PROVINCIA']);

            $dati['attachments'] = User::where('v_ie_ru_personale_id_ab','=', $id_ab)->first()->attachments()->where('attachmenttype_codice','DOC_CV')->get();                                                             
            //cercare l'ultima precontrattuale inserita stato = 0 o stato = 1 docente_id id_ab
            $copy = Anagrafica::orderBy('id','desc')->leftJoin('precontr', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })                        
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');                
            })           
            ->where('precontr.docente_id', $id_ab)->where('stato','<',2)->first(['users.nome',
                                                     'users.cognome',
                                                     'users.cf',
                                                     'precontr.docente_id as id_ab',
                                                     'a1_anagrafica.*']);

            $dati['copy'] = $copy;      
            $dati['metadata'] = ['stato_civile' =>Anagrafica::statoCivileLista($dati->sesso)];
            $success = true;

       
        return compact('dati', 'message', 'success');
    }

    public function showlocal($id) {
        $datiAnagrafica = [];
        $message = '';
       
            $datiAnagrafica = Anagrafica::leftJoin('precontr', function($join) {
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
            ->where('a1_anagrafica.id', $id)->first(['users.nome',
                                                     'users.cognome',
                                                     'users.cf',
                                                     'a1_anagrafica.*',
                                                     'a1_anagrafica.created_at AS createdDate',
                                                     'precontr.*',
                                                     'p1_insegnamento.insegnamento',
                                                     'p1_insegnamento.aa',
                                                     'p2_natura_rapporto.flag_rapp_studio_univ',
                                                      'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                      'p2_natura_rapporto.flag_titolare_pensione',
                                                      'p2_natura_rapporto.natura_rapporto',]);

            $attach = User::where('v_ie_ru_personale_id_ab','=', $datiAnagrafica['docente_id'])->first();
            if ($attach){
                $datiAnagrafica['attachments'] = $attach->attachments()->where('attachmenttype_codice','DOC_CV')->get();                                                             
            }else{
                $datiAnagrafica['attachments'] = [];
            }
            
            $pre = Precontrattuale::with(['validazioni'])->where('a1_anagrafica_id', $id)->first();                                                        
            $datiAnagrafica['validazioni'] = $pre->validazioni;

            $datiAnagrafica['metadata'] = ['stato_civile'=> Anagrafica::statoCivileLista($datiAnagrafica['sesso'])];

            $success = true;
       
        return compact('datiAnagrafica', 'message', 'success');
    }

    public function store(Request $request) {
        
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $datiAnagrafica = [];
        $message = '';
        $success = true;
     
        $anagrafica = new Anagrafica();
        $postData = $request->except('id', '_method');             
        $datiAnagrafica = $this->repo->store($postData);
    
        return compact('datiAnagrafica', 'message', 'success'); 
    }

    public function update(Request $request, $id)
    {
        
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        } 

        $pre = Precontrattuale::with(['validazioni','user'])->where('a1_anagrafica_id', $id)->first();
        if ($pre->isBlockedAmministrativa()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }   

        $datiAnagrafica = [];
        $message = '';

        $dati = Anagrafica::findOrFail($id);
        $original = $dati->toArray();        
        $postData = $request->except('id', '_method');
        $success = $dati->update($postData);
        
        if (array_key_exists('attachments',$postData)){            
            //salvare allegati ...             
            $this->repo->saveAttachments($postData['attachments'], $pre->user);
        }  

        $msg = '';
        $toTrace =null;
        if (!$dati->wasRecentlyCreated) {                               
            $toTrace = Arr::only($dati->getChanges(),Audit::$toTrace);
            foreach ($toTrace  as $key => $value) {
                //dati da memorizzare ... 
                //e notificare ...                
                $audit = new Audit();
                $audit->field_name = $key;
                $audit->old_value = $original[$key] ?: '';
                $audit->new_value = $dati[$key]  ?: '';
                $dati->audit()->save($audit);
                Log::info('Variazione ['. $key .']');                
                $msg .= ' da '. $original[$key].' a '. $value.';';                
            }
        }

        //this.storyProcess('Modello A.1: Aggiornamento dati anagrafici del collaboratore');
        $precontr  = $dati->precontrattuale()->first();
        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello A.1: Aggiornamento dati anagrafici del collaboratore', 
            $precontr->insegn_id)
        ); 

        if (count($toTrace)>0){
            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello A.1: Variazione dati di residenza'.$msg, 
                $precontr->insegn_id)
            );  
        }     

        $datiAnagrafica = $dati;
   
        return compact('datiAnagrafica', 'message', 'success');
    }

  
    

}
