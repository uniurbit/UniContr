<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TitulusRef;
use App\Service\EmailService;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Soap\Request\SaveDocument;
use App\Soap\Request\SaveParams;
use App\Soap\Request\AttachmentBean;
use App\Precontrattuale;
use App\PrecontrattualePerGenerazione;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use App\Models\AnagraficaUgov;
use Carbon\Carbon;
use App\Service\PrecontrattualeService;
use App\Models\FirmaUtenteInterface;
use App\Repositories\PrecontrattualeRepository;
use App\Service\FirmaUSIGNService;
use Storage;

class VerificaFirmaDigitaleCompletata extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:verificafirma';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica se la firma digitale è stata completata';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    /**
     * getPrecontrsDaVisionare
     * 
     * restituisce tutte le precontrattuali in 
     * in stato NON annullato 
     * in stato validato ma non accettato (firmato)
     * 
     * @return precontrattuali 
     */
    public function getPrecontrsDaVisionare(){
        return Precontrattuale::with(['validazioni'])->whereHas('validazioni', function ($query) {
            $query->where('flag_submit','=',1)->where('flag_upd','=',1)->where('flag_amm','=',1)->where('flag_accept','=',0);
        })->where('stato','=',0)->get();  
    }
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        Log::info('Esecuzione comando [ VerificaFirmaDigitaleCompletata ]');          

        //trovare tutte le precontrattuali: 
        // in stato NON annullato 
        // in stato validato ma non accettato (firmato)
        $repo = new PrecontrattualeRepository(app());
        $service = new PrecontrattualeService($repo);

        $pres = $this->getPrecontrsDaVisionare();
        foreach ($pres as $pre) {                
            try{

                // la precontrattuale ha un processo di firma da completare??? 
                 $firmaUtente = $pre->firmaUtente();
                if ($firmaUtente != null){
                    //esegui la richiesta                                      
                    $result = null;
                    if ($firmaUtente->nomeProvider == 'FIRMAIO'){
                        //$service = new FirmaIOService();    
                        $result = $service->richiestaFirmaIO($pre->insegn_id);
                    }
                    if ($firmaUtente->nomeProvider == 'USIGN'){
                        //$service = new FirmaUSIGNService();    
                        $result = $service->richiestaFirmaUSIGN($pre->insegn_id); 
                    }
                    
                    if ($result){
                        if ($result['success']){
                            Log::info('Verifica aggiornamento eseguita con successo [ precontr_id =' . $pre->id . '] '.$result['message']); 
                            //nei dati ci può essere FirmaIO, FirmaUSIGN o la Precontrattuale solo se ritorna la Precontrattuale il contratto è firmato
                            if ($result['data'] instanceof Precontrattuale){
                                Log::info('Contratto firmato [ precontr_id =' . $pre->id . '] '); 
                            }else{
                                //TODO VERIFICARE DA QUANTO TEMPO è PRESENTE L'ISTANZA DI FIRMA 
                                $createdAt = $firmaUtente->created_at;
                                $currentDate = Carbon::now();
                                 // Calculate the number of days since the firma was created
                                $daysDifference = (int) $createdAt->diffInDays($currentDate, true);
                                if ($daysDifference > 15) {
                                    $localService = null;
                                    if ($firmaUtente->nomeProvider == 'FIRMAIO'){             
                                        //impostata scadenza di firma a 15 giorni sulla richiesta                      
                                        //$service = new FirmaIOService();                                    
                                    }else if ($firmaUtente->nomeProvider == 'USIGN'){                                    
                                        $localService = new FirmaUSIGNService();      
                                        // Log before calling cancellazioneIstanza
                                        Log::info('Calling cancellazioneIstanza for firmaUtente ID: ' . $firmaUtente->id . ' with provider: ' . $firmaUtente->nomeProvider);
                                        // Call the cancellazioneIstanza method
                                        $localService->cancellazioneIstanza($firmaUtente->id, $pre);                                  
                                    } else {
                                        Log::info('Nome provider non trovato [ nomeProvider =' . $firmaUtente->nomeProvider . ']'); 
                                    }                                                                                            
                                }                                    
                            }
                        }else{
                            Log::error('Errore nella verifica aggiornamento [ precontr_id =' . $pre->id . '] '.$result['message']); 
                        }                        
                    }else{
                        Log::info('Verifica aggiornamento NON eseguita [ precontr_id =' . $pre->id . ']'); 
                    }
                }
                                       
            } catch (Exception $e) {            
                if ($pre){
                    Log::info('Errore [ VerificaFirmaDigitaleCompletata ] [ id =' . $pre->id . ']'); 
                }                
                                            
                $handler = new Handler(Container::getInstance());
                $handler->report($e);
                break;
            }
        }

        
    }

  
}
