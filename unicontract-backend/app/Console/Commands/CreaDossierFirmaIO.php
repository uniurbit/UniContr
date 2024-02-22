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


class CreaDossierFirmaIO extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:creadossier';

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

        Log::info('Esecuzione comando [ CreaDossier ]');          
        $this->info("Esecuzione comando [ CreaDossier ]");

        $client = new FirmaIOClient();
        $response = $client->createDossier("Contratto di Insegnamento");

        if ($response->successful()){
            $dossier_id = $response->object()->id;    
        }else{
            Log::info('Errore generazione'); 
            $this->error('Errore generazione');
            return;
        }
        

        $path = $this->envPath();
          
        if (Str::contains(file_get_contents($path), 'FIRMAIO_DOSSIER_ID') === false) {
            // create new entry
            file_put_contents($path, PHP_EOL."FIRMAIO_DOSSIER_ID=$dossier_id".PHP_EOL, FILE_APPEND);
        } else {        
            // update existing entry
            file_put_contents($path, str_replace(
                'FIRMAIO_DOSSIER_ID='.$this->laravel['config']['firmaio.dossier_id'],
                'FIRMAIO_DOSSIER_ID='.$dossier_id, file_get_contents($path)
            ));
        }

        $this->displayDossierId($dossier_id);
                
    }

    /**
     * Get the .env file path.
     *
     * @return string
     */
    protected function envPath()
    {
        if (method_exists($this->laravel, 'environmentFilePath')) {
            return $this->laravel->environmentFilePath();
        }
      
        return $this->laravel->basePath('.env');
    }

      /**
     * displayDossierId.
     *
     * @param  string  $dossier id
     *
     * @return void
     */
    protected function displayDossierId($dossier_id)
    {
        $this->laravel['config']['firmaio.dossier_id'] = $dossier_id;

        $this->info("Dossier id [$dossier_id] impostato correttamente.");
    }

  
}
