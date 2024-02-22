<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Carbon\Carbon;
use Storage;
use App\Http\Controllers\FirmaIOClient;
use Illuminate\Support\Str;
use App\Precontrattuale;
use App\Models\InsegnamUgov;



class UpdateCdsCod extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:updatecdscod {anno}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Aggiorna cds_cod Insegnamenti';

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

        $anno = $this->argument('anno');
      
        //leggere precontr dell'anno

        Log::info('Esecuzione comando [ Updatecds_cod ]');   
        if (!$anno){
            $anno = 2023;
        } 
       
       
        $precontrs = Precontrattuale::with('insegnamento')->whereHas('insegnamento',function($query) use($anno){
            $query->where('aa', (int)$anno);
        })->get(); //->where('stato','<',2)
      
        $this->info('Totale precontrattuali '.count($precontrs));
        $bar = $this->output->createProgressBar(count($precontrs));
        $bar->start();

        $coper_ids = $precontrs->pluck('insegnamento.coper_id')->toArray();
        $insegnamenti = InsegnamUgov::whereIn('COPER_ID',  $coper_ids)->get();
        //leggere i dati da ugov 
        $aggiornati = 0;
        foreach ($precontrs as $precontr) {
            $ins = $insegnamenti->where('coper_id', $precontr->insegnamento->coper_id)->first();
            //se il registro è diverso da aperto
            if ($ins){
                $precontr->insegnamento->cds_cod = $ins->cds_cod;
                $precontr->insegnamento->save();
                $aggiornati++;
                $bar->advance();
            } else {
                $this->info( $precontr->id);
            }
        }
        $bar->finish();
        $this->info('');
        $this->info('Aggiornati: '.$aggiornati);
                
    }

   

 
  
}
