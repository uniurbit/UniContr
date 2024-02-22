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

class SearchDataTitulusSendEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'unicontr:searchdatatitulus';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Search data titulus';

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

        Log::info('Esecuzione comando [ SearchDataTitulusSendEmails ]');    

        $refs = TitulusRef::where('num_repertorio','=','')->orWhereNull('num_repertorio')->get();
        $response = null;
        foreach ($refs as $ref) {

            try{
                $sc = new SoapControllerTitulus(new SoapWrapper);                            
                $response = $sc->loadDocument($ref->physdoc,false);    
                Log::info('Risposta loadDocument [ SearchDataTitulusSendEmails ] [' . $response . ']');   
                $obj = simplexml_load_string($response);    
                $document = $obj->Document;    
                $doc = $document->doc;
            
                $num_prot = (string)$doc['num_prot'];
                $repertorio = (string)$doc->repertorio['numero'];  
                $bozza = (string)$doc['bozza'];
                $signed = true;    

                $file = null;

                if($repertorio != '') {
                           
                    foreach ($doc->files->children('xw',true) as $file) {
                        // downloading file
                        $file == null;
                        $signed = (string) $file->attributes()->signed;
                        if ($signed == 'false'){
                            foreach ($file->children('xw',true) as $internalfile) {
                                $signed = (string) $internalfile->attributes()->signed;
                                if ($signed == 'true'){
                                    $fileId = (string) $internalfile->attributes()->name;                    
                                    $file =  $sc->getAttachment($fileId);                                                            
                                }
                            }
                        } 
                        if ($signed == 'true'){
                            foreach ($file->children('xw',true) as $internalfile) {
                                $signed = (string) $internalfile->attributes()->signed;
                                if ($signed == 'true'){
                                    $fileId = (string) $internalfile->attributes()->name;                    
                                    $file =  $sc->getAttachment($fileId);                                                            
                                }
                            }
                        } 
                        if ($file==null){
                            $fileId = (string) $file->attributes()->name;   
                            $file =  $sc->getAttachment($fileId);
                        }                                                               
                    }
                    
                    //aggiornamento tabella titulus ref 
                    $ref->num_protocollo = $num_prot;
                    $ref->num_repertorio = $repertorio;
                    $ref->bozza = 'no'; //$bozza;
                    $ref->signed = $signed == 'true' ? true : false;
                    $ref->save();

                    $pre = Precontrattuale::where('insegn_id',$ref->insegn_id)->first();
                    $pre->stato = 1;
                    $pre->save();

                    //invio email al docente
                    EmailService::sendEmailContratto($ref->insegn_id, $file->content,  $ref->physdoc.'_contratto_di_insegnamento.pdf');
                
                    Log::info('Contratto firmato [ SearchDataTitulusSendEmails ] [ insegn_id =' . $ref->insegn_id . '] 
                        [ id =' . $pre->id . '] [ repertorio='. $repertorio.']');  
                                
                }
                
            } catch (\Exception $e) {
                Log::info('Errore [ SearchDataTitulusSendEmails ] [ insegn_id =' . $ref->insegn_id . ']'); 
                if ($response) 
                    Log::info($response);                            
                $handler = new Handler(Container::getInstance());
                $handler->report($e);
            }

        }
        
    }

  
}
