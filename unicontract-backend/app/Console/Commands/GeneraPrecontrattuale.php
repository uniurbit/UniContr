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
use Storage;

class GeneraPrecontrattuale extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:generaprecontrattuale {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera precontrattuale';

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
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        Log::info('Esecuzione comando [ GeneraPrecontrattuale ]');          

        $id = $this->argument('id');

        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','p2naturarapporto'])->where('precontr.id',$id)->first();  

        try{
                       
            //salva documento in Titulus in stato di bozza
            $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA');            

            Storage::disk('local')->put('Contratto'. $pre->user->nameTutorString() .'.pdf', $pdf->output());   

        } catch (\Exception $e) {            
            if ($pre){
                Log::info('Errore [ GeneraPrecontrattuale ] [ id =' . $pre->id . ']'); 
            }
            
                                        
            $handler = new Handler(Container::getInstance());
            $handler->report($e);
        }
        
    }

  
}
