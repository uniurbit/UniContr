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
use App\Service\PrecontrattualeService;
use App\Mail\ErrorNotificationMail;
use Illuminate\Support\Facades\Mail;

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
                if (!$obj) {
                    Log::error('Failed to parse XML response. [ insegn_id =' . $ref->insegn_id . ']');
                    continue;
                }

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
                        //il file principale deve risultare firmato (firmaio, usign o grafometrica)
                        $signed = (string) $file->attributes()->signed;

                        // Genera un'eccezione se il primo file non è firmato
                        if ($signed === 'false') {
                            $errorMessage = 'Il file principale non è firmato. [ insegn_id =' . $ref->insegn_id . '] [ physdoc = ' . $ref->physdoc . ']';
                            // Send error email
                            Mail::to(['marco.cappellacci@uniurb.it', 'enrico.oliva@uniurb.it'])->send(new ErrorNotificationMail($errorMessage));                            

                            throw new Exception($errorMessage);
                        }

                        if ($signed == 'false'){
                            foreach ($file->children('xw',true) as $internalfile) {
                                $signed = (string) $internalfile->attributes()->signed;
                                if ($signed == 'true'){
                                    $fileId = (string) $internalfile->attributes()->name;                    
                                    $file =  $sc->getAttachment($fileId);                                                            
                                }
                            }
                        } else if ($signed == 'true'){
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

                    try{
                        $pre->storyprocess()->save(
                            PrecontrattualeService::createStoryProcess('Aggiornamento: Contratto firmato dal Rettore. Numero di protocollo '.$num_prot, 
                            $pre->insegn_id)
                        ); 
                    } catch (\Exception $e) {
                        Log::error($e);
                    }
            
                    //invio email al docente
                    EmailService::sendEmailContratto($ref->insegn_id, $file->content,  $ref->physdoc.'_contratto_di_insegnamento.pdf');
                
                    Log::info('Contratto firmato [ SearchDataTitulusSendEmails ] [ insegn_id =' . $ref->insegn_id . '] 
                        [ id =' . $pre->id . '] [ repertorio='. $repertorio.']');  
                                
                }
                
            } catch (Exception $e) {
                Log::info('Errore [ SearchDataTitulusSendEmails ] [ insegn_id =' . $ref->insegn_id . ']'); 
                Log::error($e);
                                     
                $handler = new Handler(Container::getInstance());
                $handler->report($e);

                // Continue to the next record
                continue;
            }

        }
        
    }

  
}
