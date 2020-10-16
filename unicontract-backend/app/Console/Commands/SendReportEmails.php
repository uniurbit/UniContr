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
use App\Exceptions\Handler;
use Illuminate\Container\Container;

//php artisan sendreport:segreterie
class SendReportEmails extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:sendreport';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Spedizione email alle segreterie';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function getPrecontrs($dip){
        return PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto','validazioni'])
            ->whereHas('insegnamento', function ($query) use($dip) {
                $query->where('dipartimento','like','%'.$dip.'%');
            })->where('stato','=',0)->get();          
    }
    
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {        
        $dips = ['DISPEA','DISB','DIGIUR','DISCUI','DESP','DISTUM'];
        //$dips = ['DISTUM'];
        Log::info('Esecuzione comando [ SendReportEmails ]');    
      
            foreach ($dips as $dip) {

                try {
                    # code...                
                    if ($dip == 'DIGIUR'){
                        $pres = $this->getPrecontrs('GIURISPRUDENZA');              
                    }else{
                        $pres = $this->getPrecontrs($dip);     
                    }                               
                    
                    //se esiste almeno una precontrattuale invio email alle segreterie 
                    if ($pres->count()>0){
                        $result = PrecontrattualeService::makePdfFromPresForReport($dip, $pres);                       
                        $email = new ReportSegreterieEmail($dip,$result->download(),'ELENCO_CONTRATTI_DOCENZA_NON_ANCORA_STIPULATI_'.$dip.'.pdf');        
                        
                        if (App::environment(['local','preprod'])) {                        
                            Mail::to(config('unidem.administrator_email'))->send($email);                           
                        } else {
                            Mail::to(['direttore.'.strtolower($dip).'@uniurb.it','segreteria.'.strtolower($dip).'@uniurb.it'])                   
                                ->bcc(config('unidem.administrator_email'))                            
                                ->cc(config('unidem.cc_report_segreterie'))
                                ->send($email);
                        }          
                    }
                } catch (\Exception $e) {
                    $handler = new Handler(Container::getInstance());
                    $handler->report($e);

                    Log::info('Errore SendReportEmails ['.$dip.']');                                             
                    
                }
            }
      
    }
}
