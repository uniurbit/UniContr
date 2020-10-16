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
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use App\Models\AnagraficaUgov;
use Carbon\Carbon;

class SearchData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:searchdata';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search data';

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

        Log::info('Esecuzione comando [ SearchData ]');    

        $precontrs = Precontrattuale::with(['anagrafica'])->whereHas('insegnamento', function ($query) {
                $query->whereIn('aa',['2019','2020']);
            })->get();
            
        $response = null;
        try{
            foreach ($precontrs as $pre) {                                                
              //Inserire qui la logica di aggiornamento
            }
        } catch (\Exception $e) {
            Log::info('Errore [ SearchData ] [ id =' . $pre->id . ']'); 
                                        
            $handler = new Handler(Container::getInstance());
            $handler->report($e);
        }
        
    }

  
}
