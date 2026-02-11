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
use Smalot\PdfParser\Parser;
use View;
use App\Service\UtilService;

class GeneraDatasetPrecontrattuali extends Command
{

    protected $signature = 'unicontr:genera-dataset-contratti';
    protected $description = 'Generate a dataset for training contracts in JSON format, split into multiple files (max 200MB each).';
    private $maxFileSize = 50 * 1024 * 1024; // 200MB in bytes

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

        Log::info('Esecuzione comando [ generate-contratti-dataset ]');          

        $dataset = [];
        $counter = 0;
        $currentFileSize = 0;
        $fileIndex = 1;
      
        $precontrattuali = PrecontrattualePerGenerazione::with(['anagrafica', 'user', 'insegnamento', 'p2naturarapporto'])->whereHas('validazioni',function($query){
            $query->where('flag_amm', 1)->where('flag_upd', 1);  //validate          
        })->whereNotIn('stato',[2,3])->get();      //non annullate

        $parser = new Parser();        

        $this->info('Numero contratti '.$precontrattuali->count()); 

        foreach ($precontrattuali as $pre) {
            try{
                $this->info('Contratto '.$pre->id); 
                // Convert the entire PrecontrattualePerGenerazione to an array, including nested relationships like 'anagrafica'
                $pre_array = [
                    'nome' => $pre->nome,
                    'cognome' => $pre->cognome,
                    'naturarapporto' => $this->naturaRapporto($pre->p2naturarapporto),
                    'tipocontratto' => $this->tipoContratto($pre->insegnamento->tipo_contratto),
                    'anagrafica' => $pre->anagrafica->toArray(),
                    'insegnamento' => $pre->insegnamento->toArray(),
                    //'naturarapporto' => $pre->p2naturarapporto->toArray()
                ];                

                unset($pre_array['anagrafica']['telefono_abitazione']);
                unset($pre_array['anagrafica']['telefono_cellulare']);
                unset($pre_array['anagrafica']['telefono_ufficio']);
                unset($pre_array['anagrafica']['fax']);
                unset($pre_array['anagrafica']['email']);

                $html_structure = View::make('contratto',['pre' => $pre, 'type'=>'CONTR_FIRMA'],[])->render();                
                
                $pdf = PrecontrattualeService::makePdfForContratto($pre, 'CONTR_FIRMA');                  
                $pdfOutput = $pdf->output();

                $pdf_parsered = $parser->parseContent($pdfOutput);
                $pdf_text = $pdf_parsered->getText();

                $contract_types[] = 'CONTRATTO DI DIRITTO PRIVATO PER ATTIVITÀ DI INSEGNAMENTO';
                $contract_types[] = $pre->tipoContr;
                $contract_types[] = $pre->p2naturarapporto->naturaRapportoToString();

                // Create the JSON entry
                $entry = [
                    'input' => array_merge(
                        ['html_structure' => $html_structure],
                        $pre_array
                    ),
                    'output' => $pdf_text,
                    'contract_type_label' => implode(', ', array_unique($contract_types)),
                ];

                // Add the entry to the dataset
                $dataset[] = $entry;

                // Check file size
                $currentFileSize = strlen(json_encode($dataset));
                $this->info('Dimensione '.$currentFileSize); 
                // If the file size exceeds 200MB, write the current dataset to a new file
                if ($currentFileSize >= $this->maxFileSize) {
                    $this->writeToFile($dataset, $fileIndex);
                    $fileIndex++;
                    $dataset = []; // Reset dataset for the next file
                }


            } catch (\Exception $e) {            
                if ($pre){
                    $this->info('Errore '.$pre->id); 
                    Log::info('Errore [ generate-contratti-dataset ] [ id =' . $pre->id . ']'); 
                }          
            }       
        }

        // Write any remaining data to the last file
        if (count($dataset) > 0) {
            $this->writeToFile($dataset, $fileIndex);
        }

        $this->info('Dataset generated successfully!');        
    }

    // Write dataset to JSON file
    private function writeToFile($dataset, $fileIndex)
    {
        $filename = "dataset_part_{$fileIndex}.json";
        Storage::disk('local')->put($filename, json_encode($dataset, JSON_PRETTY_PRINT));
        $this->info("File {$filename} written.");
    }

    public function tipoConferimento($value) {
        return UtilService::tipoConferimento($value);        
    }

    public function tipoContratto($value) {
        return UtilService::tipoContratto($value);          
    }

    public function naturaRapporto($p2naturarapporto) {
        return UtilService::naturaRapporto($p2naturarapporto);  
    }

}
