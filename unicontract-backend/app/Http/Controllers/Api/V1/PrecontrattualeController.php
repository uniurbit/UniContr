<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Precontrattuale;
use App\User;
use App\PrecontrattualePerGenerazione;
use App\Models\Insegnamenti;
use Auth;
use App\Repositories\PrecontrattualeRepository;
use App\Models\Validazioni;
use App\Service\PrecontrattualeService;
use App\Service\FirmaIOService;
use Carbon\Carbon;
use App\Service\EmailService;
use Illuminate\Support\Str;
use App\Service\TitulusHelper;
use App\Exports\PrecontrattualeExport;
use Illuminate\Support\Facades\Log;
use App\Models\InsegnamUgov;
use PHP_IBAN\IBAN;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Exception;
use Illuminate\Support\Arr;
use App\Http\Controllers\FirmaIOClient;

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

    public function show($id){
        $precontr = Precontrattuale::with(['insegnamento'])->withoutGlobalScopes()->where('id', $id)->first(); 
        return $precontr;
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
   
            $precontr = Precontrattuale::withoutGlobalScopes()->where('insegn_id', $insegn_id); 
            $postData = $request->except('id', '_method');
            $success = $precontr->update($postData);
            $data = $precontr;
       
        return compact('data', 'message', 'success');
    }

    private function controlliCopertura($insegnamentoUgov, $precontr)
    {

        $data = [];
        //verificare la data di conferimento
        if (!$insegnamentoUgov->motivo_atto_cod){                
            $message = 'Insegnamento non aggiornabile: motivo atto non inserito';
            $success = false;            
            return compact('data', 'message', 'success');
        }
        
        if (
            $insegnamentoUgov->data_ini_contratto === null ||
            $insegnamentoUgov->data_fine_contratto === null
        ) {
            $message = 'Insegnamento non aggiornabile: data di inizio o fine mancante';
            $success = false;
            return compact('data', 'message', 'success');
        }

        //verificare motivo atto non supportato
        if ($insegnamentoUgov->motivo_atto_cod && !in_array($insegnamentoUgov->motivo_atto_cod, ['BAN_INC','APPR_INC','CONF_INC'])){
            $message = 'Insegnamento non aggiornabile: motivo atto non supportato';
            $success = false;            
            return compact('data', 'message', 'success');
        }
        
        //verificare la data di conferimento
        if (!$insegnamentoUgov->data){                
            $message = 'Insegnamento non aggiornabile: data conferimento non inserita';
            $success = false;            
            return compact('data', 'message', 'success');
        }
        
        if ($insegnamentoUgov->data_ini_contratto > $insegnamentoUgov->data_fine_contratto){
            $message = 'Insegnamento non aggiornabile: data di fine insegnamento antecedente alla data di inizio';
            $success = false;            
            return compact('data', 'message', 'success');
        }     
        
        if ($insegnamentoUgov->motivo_atto=='APPR_INC' && !in_array($insegnamentoUgov->tipo_contratto, ['ALTQG','ALTQC','ALTQU'])){
            $data = null;
            $message = 'Insegnamento non aggiornabile: tipologia copertura non coerente con il motivo atto';
            $success = false;            
            return compact('data', 'message', 'success');
        }
        
        if ($insegnamentoUgov->motivo_atto=='BAN_INC' && !in_array($insegnamentoUgov->tipo_contratto, ['CONTC', 'CONTU', 'INTC', 'INTU', 'INTXU', 'INTXC', 'SUPPU', 'SUPPC'])){
            $data = null;
            $message = 'Insegnamento non aggiornabile: tipologia copertura non coerente con il motivo atto';
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

            if ($precontr->p2naturarapporto->natura_rapporto !== 'PTG' &&  $precontr->flag_no_compenso == 0){
                if ($insegnamentoUgov->compenso == null || $insegnamentoUgov->compenso <= 0){                
                    $message = 'Insegnamento non aggiornabile: compenso non inserito';
                    $success = false;            
                    return compact('data', 'message', 'success');
                }
            }
        
        }
        
        if ($insegnamentoUgov->motivo_atto_cod=='CONF_INC'){
            $value = Cache::pull('counter_'.$insegnamentoUgov->coper_id);
            //update
            $docente = $precontr->user; 
            $force = false;
            if ($docente){                  
                $coper_ids = $docente->getForzaCoperturaIds();    
                //se il coper id è dentro 
                $force = in_array($insegnamentoUgov->coper_id,$coper_ids);
            }
            $contatore = InsegnamUgovController::contatoreInsegnamenti($insegnamentoUgov->coper_id, $force);
            

            if ($contatore == 0){
                Log::info('Contatore a 0 - Importato contratto [ coper_id =' . $insegnamentoUgov->coper_id . '] [contatore insegnamenti = '.$contatore);                  
                $handler = new Handler(Container::getInstance());
                $handler->report(new Exception('Aggiornato contratto con contatore a 0  [ coper_id =' . $insegnamentoUgov->coper_id . ']'));
                
                $message = 'Insegnamento non aggiornabile: con contatore a 0. Verificare sede, che corrisponda con i precedenti insegnamenti.';
                $success = false;            
                return compact('data', 'message', 'success');

                // $data = null;
                // $message = 'Insegnamento non importabile come RINNOVO CONTRATTO: non ci sono precedenti insegnamenti corrispondenti';
                // $success = false;            
                // return compact('data', 'message', 'success');
            }
        }
       
    }

    public function changeCoperturaFromUgov(Request $request){
        $data = [];
        $success = true;
        $message = '';

        if (!Auth::user()->hasRole('super-admin')){
            $data = [];
            $message = 'Operazione non eseguibile: operatore non abilitato';
            $success = false;
            return compact('data', 'message', 'success');   
        }

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
            $message = 'Operazione di aggiornamento non eseguibile: precontrattuale validata';
            return compact('data', 'message', 'success');
        }

        //determina se un insegnamento è stato già importato e se la sua precontrattuale associata è diversa da annullato
        $precontrs = Precontrattuale::with(['insegnamento'])->whereHas('insegnamento',function($query) use($request){
            $query->where('coper_id', $request->entity['new_coper_id']);            
        })->whereNotIn('stato',[2,3])->get();

        $count = $precontrs->count();                    
        $data = [];

        if($count === 0 ) { //&& $precontrs->first()->id == $precontr->id

            //leggere da ugov insegnamento ...
            $insegnamentoUgov = InsegnamUgov::join('ANAGRAFICA', 'V_IE_DI_COPER.MATRICOLA', '=', 'ANAGRAFICA.MATRICOLA')
                ->where('V_IE_DI_COPER.COPER_ID', $request->entity['new_coper_id'])            
                ->first(['ANAGRAFICA.ID_AB', 'ANAGRAFICA.EMAIL', 'ANAGRAFICA.E_MAIL', 'ANAGRAFICA.E_MAIL_PRIVATA', 'V_IE_DI_COPER.*']); 

            //controlli per cambio 
            if ($insegnamentoUgov->aa_off_id != $precontr->insegnamento->aa){
                $message = 'Copertura non cambiabile: insegnamento non corrispondente';
                $success = false;            
                return compact('data', 'message', 'success');

            } 
            if ($insegnamentoUgov->id_ab != $precontr->docente_id){
                $message = 'Copertura non cambiabile: docente non corrispondente';
                $success = false;            
                return compact('data', 'message', 'success');
            }   
            if ($insegnamentoUgov->af_gen_des != $precontr->insegnamento->insegnamento){
                $message = 'Copertura non cambiabile: insegnamento non corrispondente';
                $success = false;            
                return compact('data', 'message', 'success');

            } 
            if ($insegnamentoUgov->sett_des != $precontr->insegnamento->settore){
                $message = 'Copertura non cambiabile: settore non corrispondente';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            if ($insegnamentoUgov->sett_cod != $precontr->insegnamento->cod_settore){
                $message = 'Copertura non cambiabile: codice settore non corrispondente';
                $success = false;            
                return compact('data', 'message', 'success');
            }
        
            
            $this->controlliCopertura($insegnamentoUgov, $precontr);

            $precontr->insegnamento->setDataFromUgov($insegnamentoUgov);
            $da_coper_id =  $precontr->insegnamento->coper_id;

            $precontr->insegnamento->coper_id = $insegnamentoUgov->coper_id;

            $precontr->insegnamento->save();
    
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello P1: Cambio codice copertura da '.$da_coper_id.' a '. $precontr->insegnamento->coper_id.' stesso insegnamento', 
                $precontr->insegn_id)
            );

            $data = $precontr->insegnamento;

            return compact('data', 'message', 'success');


        } else{
            $message = 'Copertura non cambiabile: copertura già in UniContr';
            $success = false;            
            return compact('data', 'message', 'success');
        }
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
            //se è validata non posso aggiornare tutto  ... prima sblocca poi si rivalida ...

             //leggere da ugov insegnamento ...
            $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $precontr->insegnamento->coper_id)            
            ->first(['coper_id', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 'numero', 'data', 'cds_cod']);  

            $precontr->insegnamento->setDataFromUgovDelibera($insegnamentoUgov);
            $precontr->insegnamento->save();

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello P1: Aggiornamento tipo atto', 
                $precontr->insegn_id)
            );

            $data = [];
            $success = true;
            $message = 'Operazione di aggiornamento eseguita solo per tipo di atto. Precontrattuale validata';
            return compact('data', 'message', 'success');
        }

        //leggere da ugov insegnamento ...
        $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $precontr->insegnamento->coper_id)            
            ->first(['coper_id', 'tipo_coper_cod', 'data_ini_contratto', 'data_fine_contratto', 
                'coper_peso', 'ore', 'compenso', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 
                'numero', 'data', 'des_tipo_ciclo', 'sett_des', 'sett_cod','af_radice_id', 'cds_cod', 'part_stu_cod', 'part_stu_des']);  



        $this->controlliCopertura($insegnamentoUgov, $precontr);

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

            //verificare motivo atto
            if (!$request->insegnamento['motivo_atto']){                
                $message = 'Insegnamento non importabile: motivo atto non inserito';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            //verificare motivo atto non supportato
            if ($request->insegnamento['motivo_atto'] && !in_array($request->insegnamento['motivo_atto'], ['BAN_INC','APPR_INC','CONF_INC'])){
                $message = 'Insegnamento non importabile: motivo atto non supportato';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            //verificare la data di conferimento
            if (!$request->insegnamento['data_delibera']){                
                $message = 'Insegnamento non importabile: data conferimento non inserita';
                $success = false;            
                return compact('data', 'message', 'success');
            }

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
                $message = 'Insegnamento non importabile: tipologia di copertura non riconosciuta';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            //verificare che al docente sia associata una email istituzionale        
            if ($request->docente['email'] && !Str::contains(strtolower($request->docente['email']),'@uniurb.it')){
                $data = null;
                $message = 'Insegnamento non importabile: al docente '.$request->docente['name'].' non è associata una email istituzionale';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            if ($request->insegnamento['motivo_atto']=='APPR_INC' && !in_array($request->insegnamento['tipo_contratto'], ['ALTQG','ALTQC','ALTQU'])){
                $data = null;
                $message = 'Insegnamento non importabile: tipologia copertura non coerente con il motivo atto';
                $success = false;            
                return compact('data', 'message', 'success');
            }
            
            if ($request->insegnamento['motivo_atto']=='BAN_INC' && !in_array($request->insegnamento['tipo_contratto'], ['CONTC', 'CONTU', 'INTC', 'INTU', 'INTXU', 'INTXC', 'SUPPU', 'SUPPC'])){
                $data = null;
                $message = 'Insegnamento non importabile: tipologia copertura non coerente con il motivo atto';
                $success = false;            
                return compact('data', 'message', 'success');
            }

            // if ($request->insegnamento['motivo_atto']=='CONF_INC' && !in_array($request->insegnamento['tipo_contratto'], ['CONTC', 'CONTU', 'INTC', 'INTU', 'INTXU', 'INTXC', 'SUPPU', 'SUPPC'])){
            //     //verifico che nel passato il PRIMO in ordine decrescente dei contratti sia un 'BAN_INC'   
            //     $datiUgov = self::queryFirstMotivoAttoCod($coper_id, ['APPR_INC', 'BAN_INC']);
            //     if ($dataUgov == null || $dataUgov->motivo_atto_cod_inizio != 'BAN_INC'){
            //         $data = null;
            //         $message = 'Insegnamento non importabile: rinnovo con tipologia di contratto non coerente il primo conferimento';
            //         $success = false;            
            //         return compact('data', 'message', 'success');
            //     }
            // }

            // if ($request->insegnamento['motivo_atto']=='CONF_INC' && !in_array($request->insegnamento['tipo_contratto'], ['ALTQG','ALTQC','ALTQU'])){
            //     //verifico che nel passato iL PRIMO in ordine decrescente dei contratti sia un 'APPR_INC'
            //     //verifico che nel passato il PRIMO in ordine decrescente dei contratti sia un 'BAN_INC'   
            //     $datiUgov = self::queryFirstMotivoAttoCod($coper_id, ['APPR_INC', 'BAN_INC']);
            //     if ($dataUgov == null || $dataUgov->motivo_atto_cod_inizio != 'APPR_INC'){
            //         $data = null;
            //         $message = 'Insegnamento non importabile: rinnovo con tipologia di contratto non coerente il primo conferimento';
            //         $success = false;            
            //         return compact('data', 'message', 'success');
            //     }
            // }

            if ($request->insegnamento['motivo_atto']=='CONF_INC'){                       
                //nuovo
                $docente = User::where('v_ie_ru_personale_id_ab', $request->docente['v_ie_ru_personale_id_ab'])->first();     
                $force = false;
                if ($docente){                  
                    $coper_ids = $docente->getForzaCoperturaIds();    
                    //se il coper id è dentro 
                    $force = in_array($request->insegnamento['coper_id'],$coper_ids);
                }
                
                $contatore = InsegnamUgovController::contatoreInsegnamenti($request->insegnamento['coper_id'], $force);              
                if ($contatore == 0){
                    Log::info('Contatore a 0 - Importato contratto [ coper_id =' . $request->insegnamento['coper_id'] . '] [contatore insegnamenti = '.$contatore);                  
                    $handler = new Handler(Container::getInstance());
                    $handler->report(new Exception('Importato contratto con contatore a 0  [ coper_id =' . $request->insegnamento['coper_id'] . ']'));

                    //aggiunte informazioni id_sorgente_rinnovo e motivazione_sorgente_rinnovo
                    // if (!$force){
                    //     $data = null;
                    //     $message = 'Insegnamento non importabile come RINNOVO CONTRATTO: non ci sono precedenti insegnamenti corrispondenti. Verificare esistenza di un bando precedente. Verificare sede, che corrisponda con i precedenti insegnamenti.';
                    //     $success = false;            
                    //     return compact('data', 'message', 'success');
                    // }
                    
                }else{
                    Log::info('Importato contratto [ coper_id =' . $request->insegnamento['coper_id'] . '] [contatore insegnamenti = '.$contatore);
                }
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

    public function changeContatoreInsegnamentiManuale(Request $request){
        $data = [];
        $success = true;
        $message = 'Operazione di inserimento completata con successo';
      
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
            $message = 'Operazione di inserimento non eseguibile: precontrattuale validata';
            return compact('data', 'message', 'success');
        }

        $message = '';
        $postData = $request->except('id', '_method');
            
        $data = $this->repo->changeContatoreInsegnamentiManuale($postData);

        return compact('data', 'message', 'success');

    }


    public function changeRinnovo(Request $request){
        $data = [];
        $success = true;
        $message = 'Operazione di modifica riferimento rinnovo completata con successo';
      
        
        $message = '';
        $postData = $request->except('id', '_method');

        //verificare stato della precontrattuale se è già validata non è aggiornabile...      
        $precontr = PrecontrattualePerGenerazione::with(['validazioni','insegnamento','p2naturarapporto'])->where('insegn_id', $request->insegn_id)->first();
        
        if (!(Auth::user()->hasRole('super-admin') || Auth::user()->hasRole('op_dipartimentale'))){
            abort(403, trans('global.utente_non_autorizzato'));  
        }
        
        if (isset($postData['entity']['id_sorgente_rinnovo'])) {
            //se impostata una id_sorgente verfico che esista e non sia annullata
            $sorgente_precontr = PrecontrattualePerGenerazione::with(['validazioni', 'insegnamento', 'p2naturarapporto'])->withoutGlobalScopes()
                ->where('id', $postData['entity']['id_sorgente_rinnovo'])
                ->first();
                        
            if ($sorgente_precontr) {
                if ($sorgente_precontr->isAnnullata()){
                    $data = [];
                    $message =  'Operazione di modifica non eseguibile: sorgente del rinnovo annullata';
                    $success = false;
                    return compact('data', 'message', 'success');   
                }  
                
                $existingPrecontr = PrecontrattualePerGenerazione::withoutGlobalScopes()->where('id_sorgente_rinnovo', $sorgente_precontr->id)                                
                    ->where('id', '!=', $precontr->id)
                    ->where('stato', '<', 2)
                    ->count();

                if ($existingPrecontr > 0) {  
                    $data = [];
                    $message =  'Operazione di modifica non eseguibile: sorgente del rinnovo già usata';
                    $success = false;
                    return compact('data', 'message', 'success');   
                }

            }else {
                $data = [];
                $message =  'Operazione di modifica non eseguibile: sorgente del rinnovo non trovata';
                $success = false;
                return compact('data', 'message', 'success');   
            }

         
        }

        // if ($precontr->isBlocked()){
        //     $data = [];
        //     $message = trans('global.aggiornamento_non_consentito');
        //     $success = false;
        //     return compact('data', 'message', 'success');   
        // } 

        // if ($precontr->validazioni->flag_amm == 1 || $precontr->validazioni->flag_upd == 1){
        //     //se è validata non posso aggiornare  ... prima sblocca poi si rivalida ...
        //     $data = [];
        //     $success = false;
        //     $message = 'Operazione di modifica non eseguibile: precontrattuale validata';
        //     return compact('data', 'message', 'success');
        // }

        $message = '';
        $postData = $request->except('id', '_method');
            
        $this->repo->changeRinnovo($postData);

        return (new InsegnamentiController())->show($postData['insegn_id']);        
        
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

        $pre = Precontrattuale::with(['p2naturarapporto','insegnamento','anagrafica','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $pre->insegnamento->coper_id)->first();
        if ($insegnamentoUgov == null){ 
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').': il codice di copertura di questo insegnamento è stato eliminato da Ugov didattica, rimuovere la precontrattuale';
            $success = false;
            return compact('data', 'message', 'success');       
        }

        $result = $pre->checkCompilazioneModelli();
        if ($result !== true) {
            $data = [];
            $message = $result; // use the specific error message returned by the function
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


        //Notifica validazione ufficio stipendi se la precontrattuale è ... Assimilato Lavoro Dipendente
        if ($pre->p2naturarapporto && $pre->p2naturarapporto->natura_rapporto == 'ALD'){
            EmailService::sendEmailRichiestaValidazione($pre,'ufficio_stipendi');
        }
       
        

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

        // se è firmata dal rettore
        if ($pre->stato == 1){
            $data = [];
            $success = false;
            $message = 'Operazione di annullamento non eseguibile';
            return compact('data', 'message', 'success');
        }

        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();       

        //se è stata accetta ed è alla firma
        if ($valid->flag_accept == true){
            $data = [];
            $success = false;
            $message = 'Operazione di annullamento non eseguibile';
            return compact('data', 'message', 'success');
        }

        //flag_upd isValidatoAmm uff. amministrativo    
        $transition = 'annulla_amministrativa';
        if ($valid->flag_upd && $valid->flag_amm){
            $transition = 'annulla_amministrativaeconomica';
        } else if ($valid->flag_upd && $valid->current_place == 'revisione_economica'){
            $transition = 'annulla_amministrativarevisioneeconomica';
        } else if ($valid->flag_upd && $valid->current_place == 'revisione_amministrativaeconomica_economica'){
            $transition = 'annulla_revisioneamministrativaeconomica';
        }
        
        //annulla_amministrativaeconomica

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

        $entity = Arr::dot($postData['entity']);
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

        $pre = Precontrattuale::with(['p2naturarapporto','anagrafica','insegnamento','a2modalitapagamento','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $pre->insegnamento->coper_id)->first();
        if ($insegnamentoUgov == null){ 
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').': il codice di copertura di questo insegnamento è stato eliminato da Ugov didattica, rimuovere la precontrattuale';
            $success = false;
            return compact('data', 'message', 'success');       
        }

        $result = $pre->checkCompilazioneModelli();
        if ($result !== true) {
            $data = [];
            $message = $result; // use the specific error message returned by the function
            $success = false;
            return compact('data', 'message', 'success');
        }  

        
        if ($pre->a2modalitapagamento->modality == 'ACIC'){
            $iban = new IBAN($pre->a2modalitapagamento->iban);
            if (!$iban->Verify()){
                $data = [];
                $success = false;
                $message = 'Errore: IBAN non corretto';
                return compact('data', 'message', 'success');
            }
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
        $data = PrecontrattualeService::validazioneEconomica($request->insegn_id,$postData,$message);

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

        //se firmata dal rettore
        if ($pre->stato == 1){
            $data = [];
            $success = false;
            $message = 'Operazione di annullamento non eseguibile';
            return compact('data', 'message', 'success');
        }

        $valid = Validazioni::where('insegn_id',$request->insegn_id)->first();       

        //se accettata e alla firma del rettore
        if ($valid->flag_accept == true){
            $data = [];
            $success = false;
            $message = 'Operazione di annullamento non eseguibile';
            return compact('data', 'message', 'success');
        }

        $postData = $request->except('id', '_method');
        $valid->fill($postData['entity']);
        $valid->date_amm = null;
        
        $valid->workflow_apply('annulla_economica');

        //annulare anche gli stati successivi        
        $valid->flag_accept = false;
        $valid->date_accept = null;

        $valid->save();    

        $entity = Arr::dot($postData['entity']);
        $pre->storyprocess()->save(
            PrecontrattualeService::createStoryProcess('Annullamento validazione Uff. Finanze: '.$entity['note.motivazione'], 
            $pre->insegn_id)
        );

     
        $data = Validazioni::where('insegn_id',$request->insegn_id)->first();

        return compact('data', 'message', 'success');
    }

    public function presaVisioneAccettazione(Request $request){
        
        //if (!Auth::user()->hasPermissionTo('presavisione precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        //}    

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        if (!($pre->validazioni->current_place == 'validata_economica' && !$pre->validazioni->flag_accept)){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').' precontrattuale in validazione';
            $success = false;
            return compact('data', 'message', 'success'); 
        }

        $data = $this->service->presaVisioneAccettazione($request->insegn_id);        
        
        return compact('data', 'message', 'success');
    }

    public function firmaGrafometrica(Request $request){
                        
        if (!Auth::user()->hasRole(['super-admin', 'op_approvazione_amm'])) {
            abort(403, trans('global.utente_non_autorizzato'));
        }
        
        $request->validate([
            'entity.firma_dipendente.filevalue' => 'required'             
        ]);

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        if (!($pre->validazioni->current_place == 'validata_economica' && !$pre->validazioni->flag_accept)){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').' precontrattuale in validazione';
            $success = false;
            return compact('data', 'message', 'success'); 
        }

        $postData = $request->except('id', '_method');
        $data = $this->service->firmaGrafometrica($request->insegn_id, base64_decode($postData['entity']['firma_dipendente']['filevalue']));        
        
        return compact('data', 'message', 'success');
    }



    public function richiestaFirmaIO(Request $request){
                
        $success = true;
        $message = ''; 
        $data = [];

        if (!Auth::user()->hasPermissionTo('presavisione precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        if (!($pre->validazioni->current_place == 'validata_economica' && !$pre->validazioni->flag_accept)){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').' precontrattuale in validazione';
            $success = false;
            return compact('data', 'message', 'success'); 
        }
   
        return $this->service->richiestaFirmaIO($request->insegn_id);        
    }


    public function richiestaFirmaUSIGN(Request $request){
                
        $success = true;
        $message = ''; 
        $data = [];

        if (!Auth::user()->hasPermissionTo('presavisione precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        if (!($pre->validazioni->current_place == 'validata_economica' && !$pre->validazioni->flag_accept)){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').' precontrattuale in validazione';
            $success = false;
            return compact('data', 'message', 'success'); 
        }
   
        return $this->service->richiestaFirmaUSIGN($request->insegn_id);        
    }


    public function cancellazioneIstanzaFirmaUtente(Request $request){
                
        $success = true;
        $message = ''; 
        $data = [];

        if (!Auth::user()->hasPermissionTo('presavisione precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }

        $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $request->insegn_id)->first();
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $success = true;
        $message = ''; 
        $data = [];
        
        if (!($pre->validazioni->current_place == 'validata_economica' && !$pre->validazioni->flag_accept)){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').' precontrattuale in validazione';
            $success = false;
            return compact('data', 'message', 'success'); 
        }
   
        return $this->service->cancellazioneIstanzaFirmaUtente($request->insegn_id, $request->entity);        
    }

    public function terminaInoltra(Request $request){
        if (!Auth::user()->hasPermissionTo('terminainoltra precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    

        $success = true;
        $message = '';        
        $data = [];        
       
        $pre = Precontrattuale::with(['p2naturarapporto','insegnamento','anagrafica','validazioni'])->where('insegn_id', $request->insegn_id)->first();
        
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }
        
        $result = $pre->checkCompilazioneModelli();
        if ($result !== true) {
            $data = [];
            $message = $result; // use the specific error message returned by the function
            $success = false;
            return compact('data', 'message', 'success');
        }  

        $insegnamentoUgov = InsegnamUgov::where('COPER_ID', $pre->insegnamento->coper_id)->first();
        if ($insegnamentoUgov == null){ 
            $data = [];
            $message = trans('global.aggiornamento_non_consentito').': il codice di copertura di questo insegnamento è stato eliminato contattare la sua segreteria didattica';
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

    public function annullaAnnullaContratto(Request $request){
        $success = true;
        $message = '';        
        
        if (!Auth::user()->hasPermissionTo('annullacontratto precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }    
         
        $postData = $request->except('id', '_method');        
        $data = $this->repo->annullaAnnullaContratto($postData);

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

            //se ha il ruolo docente e il 
            //e ruolo operatore dipartimentale
            //nel caso multiruolo devo scegliere un ruolo
            if (Auth::user()->hasRole('op_docente') && !Auth::user()->hasRole('op_dipartimentale')){
                array_push($parameters['rules'],[
                    "operator" => "=",
                    "field" => "user.v_ie_ru_personale_id_ab",                
                    "value" => Auth::user()->v_ie_ru_personale_id_ab
                ]);
            }else{
                //aggiungere filtro per unitaorganizzativa_uo
                $uo = Auth::user()->unitaorganizzativa();

                if ($uo == null) {
                   //cerca tra i permessi
                   $uos = Auth::user()->getDipartimentiUo();
                   if ($uos && count($uos)>0){
                        array_push($parameters['rules'],[
                            "operator" => "In",
                            "field" => "insegnamento.dip_cod",                
                            "value" => $uos
                        ]);
                   }else {
                        abort(403, 'Utente senza unità organizzativa associata');
                   }                   
                } else if ($uo->isPlesso()){
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
        //non includo insegnamento.corsodistudio per problemi di connessione
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
        $queryBuilder->alias = ['precontr.id'];
        
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
    
    public function downloadContrattoFirmato($id){
        $pre = Precontrattuale::withoutGlobalScopes()->with(['attachments','user','insegnamento'])->where('id', $id)->first();

        // se l'utente NON ha il permesso di ricerca su tutti i contratti verifico se può eseguire il download
        if (!Auth::user()->hasPermissionTo('search all contratti')){           

            if (Auth::user()->hasRole('op_docente')){
                if ($pre->user->v_ie_ru_personale_id_ab != Auth::user()->v_ie_ru_personale_id_ab){
                    abort(403, trans('global.utente_non_autorizzato'));
                }                
            }else{
                //aggiungere filtro per unitaorganizzativa_uo
                $uo = Auth::user()->unitaorganizzativa();

                if ($uo == null) {
                    //cerca tra i permessi
                    $uos = Auth::user()->getDipartimentiUo();
                    if ($uos && count($uos)>0){
                        if (!(in_array($pre->insegnamento->dip_cod,$uos))){
                            abort(403, trans('global.utente_non_autorizzato'));
                        } 
                    } else {
                        abort(403, trans('global.utente_non_autorizzato'));
                    }
                } else if ($uo->isPlesso()){
                    if (!(in_array($pre->insegnamento->dip_cod,$uo->dipartimenti()))){
                        abort(403, trans('global.utente_non_autorizzato'));
                    }    
                    
                } else {
                    if ($pre->insegnamento->dip_cod != $uo->uo){
                        abort(403, trans('global.utente_non_autorizzato'));
                    }                   
                }     
            }                  
        }
        
        if ($pre->stato == 1){
            $attach =  $pre->attachments()->where('attachmenttype_codice','CONTR_FIRMA')->first();
            if ($attach){
                return (new AttachmentController())->download($attach->id);
            }                   
        }                            
        abort(404, "Documento non trovato");                         
    }

}
