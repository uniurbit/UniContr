<?php

namespace App\Console\Commands;

use App;
use Mail;
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
use App\Service\PrecontrattualeService;
use App\Mail\ReportSegreterieEmail;
use App\PrecontrattualePerGenerazione;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\Relation;
use App\Mail\SollecitoFirstEmail;
use App\Mail\SollecitoValidateEmail;
use App\Exceptions\Handler;
use Illuminate\Container\Container;

// php artisan sendsollecito:docenti 
class SendSollecitoEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:sendsollecito';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Spedizione email ai docenti';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }


    //compilazione modulistica precontrattuale NON TERMINATA 
    public function getPrecontrsNonTerminate(){
        return PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','validazioni','sendemails'=> function ($query) {
                $query->where('codifica','RCP');
            }])
            ->whereHas('validazioni', function ($query) {
                $query->where('flag_submit','=',0);
            })->where('stato','=',0)->get();          
    }

    //compilazione modulistica precontrattuale da visionare
    public function getPrecontrsDaVisionare(){
        return PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','validazioni','sendemails' => function ($query) {
                $query->where('codifica', '=', 'APP');
            }])
            ->whereHas('validazioni', function ($query) {
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
        Log::info('Esecuzione comando [ SendSollecitoEmails ]');    
        
            //giorno 10 di ogni mese, se sono passati almeno 10 giorni dall'invio della richiesta
            $pres = $this->getPrecontrsNonTerminate();                                      
            foreach ($pres as $pre) {
                try {
                    //invio richiesta di compilazione
                    $gg = $pre->giorniUltimaEmail();
                    if ($gg<0){ 
                        //'insegnamento.data_delibera' a oggi
                        $datetime1 =  $pre->insegnamento->created_at != null ?  
                            $pre->insegnamento->created_at : Carbon::createFromFormat('Y-m-d',  $pre->insegnamento->data_delibera); 
                        $datetime2 = Carbon::now();
                        $gg  = $datetime1->diffInDays($datetime2);
                    }
                    if ($gg>10){
                        //invio email di sollecito ai docenti
                        $email = new SollecitoFirstEmail($pre);            
                        EmailService::sendToDocente($email,$pre);
                    }
                  
                } catch (\Exception $e) {
                    $handler = new Handler(Container::getInstance());
                    $handler->report($e);                             
                    Log::info('Errore getPrecontrsNonTerminate SendSollecitoEmails '.$pre->user->name);                      
                }
            }                
        
            //giorno 10 di ogni mese, se sono passati almeno 10 giorni dall'invio della richiesta
            $pres = $this->getPrecontrsDaVisionare();                          
            foreach ($pres as $pre) {
                try {
                     //invio richiesta di presavisione
                    $gg = $pre->giorniUltimaEmail();
                    if ($gg<0){ 
                        $datetime1 = Carbon::createFromFormat(config('unidem.datetime_format'), $pre->validazioni->date_amm);  
                        $datetime2 = Carbon::now();
                        $gg  = $datetime1->diffInDays($datetime2);
                    }
                    if ($gg>10){
                        //invio email di sollecito ai docenti
                        $email = new SollecitoValidateEmail($pre);            
                        EmailService::sendToDocente($email,$pre);
                    }
                } catch (\Exception $e) {
                    $handler = new Handler(Container::getInstance());
                    $handler->report($e);
                    Log::info('Errore getPrecontrsDaVisionare SendSollecitoEmails '.$pre->user->name);                              
                }
            }                
        
    }
    

}
