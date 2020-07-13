<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\PrecontrattualePerGenerazione;
use App\Models\Insegnamenti;
use Auth;
use App\Repositories\PrecontrattualeRepository;
use App\Models\Validazioni;
use App\Service\PrecontrattualeService;
use Carbon\Carbon;
use App\Service\EmailService;
use Illuminate\Support\Str;
use App\Service\TitulusHelper;
use App\Exports\PrecontrattualeExport;
use Illuminate\Support\Facades\Log;
use App\Models\InsegnamUgov;

class PrecontrattualeController extends Controller
{

    /**
     * @var PrecontrattualeService
     */
    private $service;
    /**
     * @var PrecontrattualeRepository
     */
    private $repo;
    public function __construct(PrecontrattualeRepository $repo){
        $this->repo = $repo;
        $this->service = new PrecontrattualeService($repo);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {      
        $precontr = Precontrattuale::get();
        return response()->json([
            'lista' => $precontr,
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
        $data = [];
        $message = '';
       
        $precontr = new Precontrattuale();            
        $postData = $request->except('id', '_method');
        $precontr->fill($postData);
        $success = $precontr->save();
        $data = $precontr;
      
        return compact('data', 'message', 'success');
    }

    /**
     * Update the specific resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $insegn_id)
    {
        $data = [];
        $message = '';
   
            $precontr = Precontrattuale::where('insegn_id', $insegn_id); 
            $postData = $request->except('id', '_method');
            $success = $precontr->update($postData);
            $data = $precontr;
       
        return compact('data', 'message', 'success');
    }


    public function updateInsegnamentoFromUgov(Request $request){
        $data = [];
        $success = true;
        $message = '';

        //verificare stato della precontrattuale se è già validata non è aggiornabile...      
        $precontr = PrecontrattualePerGenerazione::with(['validazioni','insegnamento','p2naturarapporto'])->where('insegn_id', $request->insegn_id)->first();

        if ($precontr->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 

        if ($precontr->validazioni->flag_amm == 1 || $precontr->validazioni->flag_upd == 1){
            //se è validata non posso aggiornare  ... prima sblocca poi si rivalida ...
            $data = [];
            $success = false;
            $message = 'Operazione di aggiornamento non eseguibile';
            return compact('data', 'message', 'success');
        }

        //leggere da ugov insegnamento ...
        $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $precontr->insegnamento->coper_id)            
            ->first(['coper_id', 'tipo_coper_cod', 'data_ini_contratto', 'data_fine_contratto', 
                'coper_peso', 'ore', 'compenso', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 'numero', 'data']);  

        if ($insegnamentoUgov->data_ini_contratto > $insegnamentoUgov->data_fine_contratto){
            $message = 'Insegnamento non aggiornabile: data di fine insegnamento antecedente alla data di inizio';
            $success = false;            
            return compact('data', 'message', 'success');
        }     
        
        //verificare i cfu    
        //se c'è la p2 e 
        if ($precontr->p2naturarapporto != null){            
            //natura_rapporto == COCOCO e isDidatticaIntegrativa() o isAltaQualificazione()
            //e il numero di ore scende sotto le 15 -> ERRORE
            if ($precontr->p2naturarapporto->natura_rapporto == 'COCOCO' 
                && ($precontr->isDidatticaIntegrativa() || $precontr->isAltaQualificazione())){
                //controllo le ore 
                if ($insegnamentoUgov->ore <= 15){
                    $message = 'Insegnamento non aggiornabile: numero ore incompatibile con la scelta della natura del rapporto';
                    $success = false;            
                    return compact('data', 'message', 'success');
                }
            }
        
            //natura_rapporto == PLAO e isDidatticaIntegrativa() o isAltaQualificazione()
            //e il numero di ore sale sopra le 15 -> ERRORE
            if ($precontr->p2naturarapporto->natura_rapporto == 'PLAO' 
                && ($precontr->isDidatticaIntegrativa() || $precontr->isAltaQualificazione())){
                //controllo le ore 
                if ($insegnamentoUgov->ore > 15){
                    $message = 'Insegnamento non aggiornabile: numero ore incompatibile con la scelta della natura del rapporto';
                    $success = false;            
                    return compact('data', 'message', 'success');
                }
            }

        }

        $precontr->insegnamento->setDataFromUgov($insegnamentoUgov);

        $precontr->insegnamento->save();

        $precontr->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Modello P1: Aggiornamento dati insegnamento', 
            $precontr->insegn_id)
        );

        $data = $precontr->insegnamento;

        return compact('data', 'message', 'success');
    }



    public function newPrecontrImportInsegnamento(Request $request){
        $success = true;
        $count = 0;

        //determina se un insegnamento è stato già importato e se la sua precontrattuale associata è diversa da annullato
        $precontrs = Precontrattuale::with(['insegnamento'])->whereHas('insegnamento',function($query) use($request){
            $query->where('coper_id', $request->insegnamento['coper_id']);            
        })->whereNotIn('stato',[2,3])->get();

        $count = $precontrs->count();                    
        $data = [];
        
        if($count === 0) { 
            
            $validatedData = $request->validate([
                'insegnamento.data_ini_contr' => 'required | date', 
                'insegnamento.data_fine_contr' => 'required | date' 
            ]);

            //verificare chi le dati inizio fine assegnamento siano 
            if ($request->insegnamento['data_ini_contr'] && $request->insegnamento['data_fine_contr']){                
                $datetimeIni = Carbon::createFromFormat(config('unidem.date_format'), $request->insegnamento['data_ini_contr']);                                
                $datetimeFine = Carbon::createFromFormat(config('unidem.date_format'), $request->insegnamento['data_fine_contr']);

                if ($datetimeIni > $datetimeFine){
                    $message = 'Insegnamento non importabile: data di fine insegnamento antecedente alla data di inizio';
                    $success = false;            
                    return compact('data', 'message', 'success');
                }                
            }

            //verificare che al docente sia associata una email istituzionale        
            if ($request->insegnamento['tipo_contratto'] && !in_array($request->insegnamento['tipo_contratto'], ['ALTQG','ALTQC','ALTQU', 'CONTC', 'CONTU', 'INTC', 'INTU', 'INTXU', 'INTXC', 'SUPPU', 'SUPPC'  ])){
                $data = null;
                $message = 'Insegnamento non importabile: tipologia non riconosciuta';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            //verificare che al docente sia associata una email istituzionale        
            if ($request->docente['email'] && !Str::contains($request->docente['email'],'@uniurb.it')){
                $data = null;
                $message = 'Insegnamento non importabile: al docente '.$request->docente['name'].' non è associata una email istituzionale';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            $message = '';
            $postData = $request->except('id', '_method');
                
            $data = $this->repo->newPrecontrImportInsegnamento($postData);
        } else {
            $success = false;  
            $message = 'Insegnamento già presente nel sistema, gestire quello esistente';
        }

        return compact('data', 'message', 'success');
    }

    public function newIncompat(Request $request){
        
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';
        $postData = $request->except('id', '_method');
            
        $data = $this->repo->newIncompat($postData);

        return compact('data', 'message', 'success');
    }

    public function newPrivacy(Request $request){

        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';
        $postData = $request->except('id', '_method');
            
        $data = $this->repo->newInformativa($postData);

        return compact('data', 'message', 'success');
    }

    public function newInps(Request $request){

        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';
        $postData = $request->except('id', '_method');
            
        $data = $this->repo->newInps($postData);

        return compact('data', 'message', 'success');
    }

    public function newPrestazioneProfessionale(Request $request){

        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';
        $postData = $request->except('id', '_method');
            
        $data = $this->repo->newPrestazioneProfessionale($postData);

        return compact('data', 'message', 'success');
    }

    //validazione amministrativa flagupd (prima)
    public function validazioneAmm(Request $request){        

        if (!Auth::user()->hasPermissionTo('validazioneamm precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';

        $pre = Precontrattuale::with(['p2naturarapporto','anagrafica','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        if (!$pre->checkCompilazioneModelli()){
            $data = [];
            $message = trans('global.validazione_non_consentita');
            $success = false;
            return compact('data', 'message', 'success');   
        }        
    
        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();

        if ($valid->flag_submit == 0){
            $data = [];
            $success = false;
            $message = 'Operazione di validazione non eseguibile';
            return compact('data', 'message', 'success');
        }

        $postData = $request->except('id', '_method');
        $valid->fill($postData['entity']);
        $valid->date_upd = Carbon::now()->format(config('unidem.datetime_format'));

        //validata_amm
        $transitions = $valid->workflow_transitions();
        $valid->workflow_apply($transitions[0]->getName());

        $valid->save();

        $data = Validazioni::where('insegn_id',$request->insegn_id)->first();

        return compact('data', 'message', 'success');
    }
   
    //annullamento amministrativo flag_upd e successivi
    public function annullaAmm(Request $request){        

        if (!Auth::user()->hasPermissionTo('annullaamm precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();       

        $transition = 'annulla_amministrativa';
        if ($valid->flag_upd && $valid->flag_amm){
            $transition = 'annulla_amministrativaeconomica';
        }

        if (!$valid->workflow_can($transition)){
            $data = [];
            $message = trans('global.annullamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $valid->workflow_apply($transition);
   
        $postData = $request->except('id', '_method');
        $valid->fill($postData['entity']);
        $valid->date_upd = null;        

        //annulare anche gli stati successivi
        $valid->flag_amm = false;
        $valid->date_amm = null;

        $valid->flag_accept = false;
        $valid->date_accept = null;

        $valid->save();
     
        $data = Validazioni::where('insegn_id',$request->insegn_id)->first();

        $entity = array_dot($postData['entity']);
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Annullamento validazione Uff. Personale: '.$entity['note.motivazione'], 
            $pre->insegn_id)
        );

        return compact('data', 'message', 'success');
    }

    //validazione economica flag_amm
    public function validazioneEconomica(Request $request){        

        if (!Auth::user()->hasPermissionTo('validazioneeconomica precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';

        $pre = Precontrattuale::with(['p2naturarapporto','anagrafica','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        if (!$pre->checkCompilazioneModelli()){
            $data = [];
            $message = trans('global.validazione_non_consentita');
            $success = false;
            return compact('data', 'message', 'success');   
        }        

        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();

        if ($valid->flag_submit == 0 || $valid->flag_upd == 0){
            $data = [];
            $success = false;
            $message = 'Operazione di validazione non eseguibile';
            return compact('data', 'message', 'success');
        }

        $pre = Precontrattuale::with(['user'])->where('insegn_id',$request->insegn_id)->first();   
        if ($pre && $pre->user->email && !Str::contains($pre->user->email,'@uniurb.it')){                    
            $data = null;
            $message = 'A '.$pre->user->nameTutorString().' non è associata una email istituzionale';
            $success = false;            
            return compact('data', 'message', 'success');
        }

        $postData = $request->except('id', '_method');
        $valid->fill($postData['entity']);
        $valid->date_amm = Carbon::now()->format(config('unidem.datetime_format'));

        $transitions = $valid->workflow_transitions();
        $valid->workflow_apply($transitions[0]->getName());

        $data = EmailService::sendEmailByType($request->insegn_id,"APP");       

        $valid->save();        

        $data = Validazioni::where('insegn_id',$request->insegn_id)->first();

        return compact('data', 'message', 'success');
    }
    
    //annulla economica flag_amm
    public function annullaEconomica(Request $request){        

        if (!Auth::user()->hasPermissionTo('annullaeconomica precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $data = [];
        $success = true;
        $message = '';
        
        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();       

        $postData = $request->except('id', '_method');
        $valid->fill($postData['entity']);
        $valid->date_amm = null;
        
        $valid->workflow_apply('annulla_economica');

        //annulare anche gli stati successivi        
        $valid->flag_accept = false;
        $valid->date_accept = null;

        $valid->save();    

        $entity = array_dot($postData['entity']);
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Annullamento validazione Uff. Finanze: '.$entity['note.motivazione'], 
            $pre->insegn_id)
        );

     
        $data = Validazioni::where('insegn_id',$request->insegn_id)->first();

        return compact('data', 'message', 'success');
    }

    public function presaVisioneAccettazione(Request $request){
        
        if (!Auth::user()->hasPermissionTo('presavisione precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    
        
        if (Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first()->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        $data = $this->service->presaVisioneAccettazione($request->insegn_id);        
        
        return compact('data', 'message', 'success');
    }

    public function terminaInoltra(Request $request){
        if (!Auth::user()->hasPermissionTo('terminainoltra precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

        $success = true;
        $message = '';        
        $data = [];        
       
        $pre = Precontrattuale::with(['p2naturarapporto','anagrafica','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }
        
        if (!$pre->checkCompilazioneModelli()){
            $data = [];
            $message = trans('global.validazione_non_consentita');
            $success = false;
            return compact('data', 'message', 'success');   
        }      

        //aggiornamento tabella validazioni        
        $valid = Validazioni::where('insegn_id', $request->insegn_id)->first();        
        if (!$valid->flag_submit){
            $postData = $request->except('id', '_method');        
            $data = $this->repo->terminaInoltra($postData);        
        }else{
            $success = false;  
            $message = 'Operazione termina già eseguita';
        }
    
        return compact('data', 'message', 'success');
    }

    public function annullaContratto(Request $request){
        $success = true;
        $message = '';        
        
        if (!Auth::user()->hasPermissionTo('annullacontratto precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

        //1--firmato
        //2--annullato prima firma
        //3--annullato dopo firma

        //se il contratto è firmato non si può annullare o almento ... occorre 
        //allegare la delibera
         
        $postData = $request->except('id', '_method');        
        $data = $this->repo->annullaContratto($postData);

        return compact('data', 'message', 'success');
    }
    
    public function rinunciaCompenso(Request $request){
        $success = true;
        $message = '';        
        
        if (!Auth::user()->hasPermissionTo('rinuncia precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

         //se il contratto è annullato non si può modificare
        if (Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first()->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }
             
        $postData = $request->except('id', '_method');        
        $data = $this->repo->rinunciaCompenso($postData);

        return compact('data', 'message', 'success');
    }

    public function annullaRinuncia(Request $request){
        $success = true;
        $message = '';        
        
        if (!Auth::user()->hasPermissionTo('rinuncia precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

         //se il contratto è annullato non si può modificare
        if (Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first()->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }
             
        $postData = $request->except('id', '_method');        
        $data = $this->repo->annullaRinuncia($postData);

        return compact('data', 'message', 'success');
    }

    public function queryparameter(Request $request){       
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'insegnamento,user,validazioni,p2naturarapporto'; 
    
        // se l'utente NON ha il permesso di ricerca su tutti i contratti
        if (!Auth::user()->hasPermissionTo('search all contratti')){           

            if (Auth::user()->hasRole('op_docente')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "user.v_ie_ru_personale_id_ab",                
                    "value" => Auth::user()->v_ie_ru_personale_id_ab
                ]);
            }else{
                //aggiungere filtro per unitaorganizzativa_uo
                $uo = Auth::user()->unitaorganizzativa();

                if ($uo == null) {
                   abort(403, trans('global.utente_non_autorizzato'));
                }    
        
                if ($uo->isPlesso()){
                    //filtro per unitaorganizzativa dell'utente di inserimento (plesso)
                    array_push($parameters['rules'],[
                        "operator" => "In",
                        "field" => "insegnamento.dip_cod",                
                        "value" => $uo->dipartimenti()
                    ]);
                } else {
                    //ad un afferente al dipartimento filtro per dipartimento                                
                    array_push($parameters['rules'],[
                        "operator" => "=",
                        "field" => "insegnamento.dip_cod",                
                        "value" => $uo->uo
                    ]);
                }     
            }                  
        }

        $findparam = new \App\FindParameter($parameters);
        return $findparam;
    }

    public function export(Request $request){
        //prendi i parametri 
        $findparam = $this->queryparameter($request);                  
        $findparam['includes'] = 'insegnamento,user,validazioni,p2naturarapporto,d1inps,d4fiscali,d2inail,d6familiari'; 

        return (new PrecontrattualeExport($request,$findparam))->download('precontrattuali.csv', \Maatwebsite\Excel\Excel::CSV,  [
            'Content-Type' => 'text/csv',
            'Content-Encoding' => 'UTF-8'
        ]);        
    }

    public function exportxls(Request $request){
        //prendi i parametri 
        $findparam = $this->queryparameter($request);                  
        $findparam['includes'] = 'insegnamento,user,validazioni,p2naturarapporto,d1inps,d4fiscali,d2inail,d6familiari'; 

        return (new PrecontrattualeExport($request,$findparam))->download('precontrattuali.xlsx');     
    }

    public function query(Request $request){ 
        $findparam = $this->queryparameter($request);

        $queryBuilder = new QueryBuilder(new Precontrattuale, $request, $findparam);
                
        return $queryBuilder->build()->paginate();            
    }


    public function previewContratto($insegn_id){
   
        $result = PrecontrattualeService::previewContratto($insegn_id);   
    
        return $result;
    }


    public function modulisticaPrecontr($insegn_id){
   
        $result = PrecontrattualeService::createModulisticaPrecontr($insegn_id);   
    
        return $result;
    }


    public function getTitulusDocumentURL($id){
        return (new AttachmentController())->getTitulusDocumentURL($id);
    }

    
    public function downloadAttachment($id){
        //todo istanziare il controller attachment
        $attach = Attachment::find($id);
        if ($attach->num_prot){
            $app = TitulusHelper::downloadAttachment($attach->nrecord);
            if ($app){
                $attach['filevalue'] =  base64_encode($app->content);                                                    
                if ($attach->filetype == 'link'){
                    $attach['filename'] = $app->title.'.pdf';
                }
            }
        }else{
            $attach['filevalue'] =  base64_encode(Storage::get($attach->filepath));
        }        
        return $attach;    
    }

}
