<?php namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use Illuminate\Support\Facades\Log;
use App\Precontrattuale;
use App\Models\Docente;
use App\Models\Insegnamenti;
use App\Models\Validazioni;
use App\Models\B2Incompatibilita;
use App\Models\B6Informativa;
use App\Models\D1_Inps;
use App\Models\TitulusRef;
use App\Models\C_PrestazioneProfessionale;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use Hash;
use App\Service\PrecontrattualeService;
use App\Service\EmailService;


class PrecontrattualeRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Precontrattuale';
    }

    public function newPrecontrImportInsegnamento(array $data){  
        DB::beginTransaction(); 
        try {
            // IMPORTAZIONE NUOVO INSEGNAMENTO DA UGOV
            $insegn = new Insegnamenti();           
            $insegn->fill($data['insegnamento']);
            $success = $insegn->save();        

            // PROFILO DOCENTE
            $docente = Docente::where('v_ie_ru_personale_id_ab', $data['docente']['v_ie_ru_personale_id_ab'])->first();            
            if (!$docente) {
                $docente = new User();                    
                $docente->fill($data['docente']);              
                $docente->password =  Hash::make($data['docente']['cf']);
                $success = $docente->save();
                $docente->assignRole('op_docente');  
            }        

            $pre = new Precontrattuale();
            $pre->insegnamento()->associate($insegn); 
            $pre->user()->associate($docente);                            

            $pre->save();            

            $validazioni = new Validazioni();
            $pre->validazioni()->save($validazioni);

            $pre->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello P.1: Importazione dati insegnamento', 
                $insegn->id)
            ); 

            //inivio email din notifica al docente RCP in automatico
            EmailService::sendEmailByType($insegn->id,"RCP");

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        $entity = Precontrattuale::with(['insegnamento','validazioni','sendemailsrcp'])->find($pre->id);
        return $entity;
    }

    

    public function newIncompat(array $data){  
        DB::beginTransaction(); 
        try {

            $entity = new B2Incompatibilita();
            $entity->fill($data['entity']);
            $success = $entity->save();

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->b2incompatibilita()->associate($entity);      
            $precontr->save();            

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.2: Compilazione modello dichiarazione di incompatibilità', 
                $data['insegn_id'])
            ); 

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        $entity = Precontrattuale::with(['b2incompatibilita'])->find($precontr->id);
        return $entity;
    }  


    
    public function newInformativa(array $data){  
        DB::beginTransaction(); 
        try {

            $entity = new B6Informativa();
            $entity->fill($data['entity']);
            $success = $entity->save();

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->b6informativa()->associate($entity);      
            $precontr->save();          

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.6: Accettazione trattamento dati e informativa sulla privacy', 
                $precontr->insegn_id)
            ); 

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        $entity = Precontrattuale::with(['b6informativa'])->find($precontr->id);
        return $entity;
    }  
    

    public function newInps(array $data){  
        DB::beginTransaction(); 
        try {

            $entity = new D1_Inps();
            $entity->fill($data['entity']);
            $success = $entity->save();

            //salvare allegati ...             
            if (array_key_exists('attachments',$data['entity'])){              
                $this->saveAttachments($data['entity']['attachments'], $entity);
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->d1inps()->associate($entity);      
            $precontr->save();

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello D.1: Compilazione modello Dichiarazione ai fini previdenziali', 
                $precontr->insegn_id)
            );

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        $entity = Precontrattuale::with(['d1inps'])->find($precontr->id);
        return $entity;
    }  
    

    
    public function newPrestazioneProfessionale(array $data){  
        DB::beginTransaction(); 
        try {

            $entity = new C_PrestazioneProfessionale();
            $entity->fill($data['entity']);
            $success = $entity->save();
         
            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->cPrestazioneProfessionale()->associate($entity);      
            $precontr->save();

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello C: Compilazione modello Prestazione Professionale', 
                $precontr->insegn_id)
            ); 

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        $entity = Precontrattuale::with(['cPrestazioneProfessionale'])->find($precontr->id);
        return $entity;
    }  
    

    public function newPresavisioneAccettazione($data, $pre){
        DB::beginTransaction(); 
        try {

            // $valid = Validazioni::where('insegn_id', $pre->insegn_id)->first();
            // if (($valid->current_place != 'validata_economica')){
            //     throw new Exception("Errore di concorrenza aggiornare");
            // }
            
            //eventuale cancellazione su annullamento validazioni
            $refs = TitulusRef::where('insegn_id', $pre->insegn_id)->delete();
            $deletes = $pre->getPrecontrattualeType()->attachments()->whereIn('attachmenttype_codice',['CONTR_FIRMA'])->delete();

            //aggiorna tabella titulus ref
            $entity = new TitulusRef();
            $entity->fill($data);               
            $pre->titulusref()->save($entity);

            //salva riferimento allegato 
            $this->saveAttachments(array($data), $pre->getPrecontrattualeType());
            
            //aggiornamento tabella validazioni
            $valid = Validazioni::where('insegn_id', $pre->insegn_id)->first();
            $valid->flag_accept = true;
            $valid->date_accept = Carbon::now()->format(config('unidem.datetime_format'));
            $valid->save();

        } catch(\Exception $e) {
                
            DB::rollback();
            throw $e;
        }
        DB::commit();  
        $entity =  Precontrattuale::with(['attachments','titulusref','validazioni'])->where('insegn_id', $pre->insegn_id)->first();
        return $entity;
    }



    public function terminaInoltra(array $data){
        DB::beginTransaction(); 
        try {

            //aggiornamento tabella validazioni
            $valid = Validazioni::where('insegn_id', $data['insegn_id'])->first();
          
            $valid->flag_submit = true;
            $valid->date_submit = Carbon::now()->format(config('unidem.datetime_format'));
            $valid->current_place = 'completata';
            $valid->save();

            //invio email 

            //creazione dell'allegato 
            $result = PrecontrattualeService::createContrattoBozza($data['insegn_id']);
            $this->saveAttachments([$result], Precontrattuale::where('insegn_id', $data['insegn_id'])->first());
            $data = EmailService::sendEmailByType($data['insegn_id'],"CMU");

            $precontr = $valid->precontrattuale()->first(); 
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Compilazione modulistica precontrattuale terminata', 
                $precontr->insegn_id)
            ); 

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();  
        return Precontrattuale::with(['attachments'])->where('insegn_id', $data['insegn_id'])->first();
    }


    public function annullaContratto(array $data){
        DB::beginTransaction(); 
        try {

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first();             
            //se il contratto è in stato 1 (firmato) passi allo stato 3 (annullato con firma)            
            if ($precontr->stato == 1){
                $precontr->stato = 3;  
            }else{
                $precontr->stato = 2; 
            }
            
            $precontr->fill($data['entity']);
            $precontr->date_annullamento = Carbon::now()->format(config('unidem.datetime_format'));
            $precontr->save();

            $msg = '';
            if ($precontr->tipo_annullamento == 'REVOC'){
                $msg = 'Revoca del contratto';
            }else{
                $msg = 'Rinuncia';
            }

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess($msg, 
                $precontr->insegn_id)
            ); 
            
        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();  
        return Precontrattuale::where('insegn_id', $data['insegn_id'])->first();
    }
    
    
    public function rinunciaCompenso(array $data){
        DB::beginTransaction(); 
        try {

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first();             
            
            $precontr->flag_no_compenso = true;
                       
            $precontr->date_flag_no_compenso = Carbon::now();
            $precontr->save();
            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Rinuncia al compenso', 
                $precontr->insegn_id)
            ); 

        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();  
        return Precontrattuale::where('insegn_id', $data['insegn_id'])->first();
    }

    public function annullaRinuncia(array $data){
        DB::beginTransaction(); 
        try {

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first();             
            
            $precontr->flag_no_compenso = false;
                       
            $precontr->date_flag_no_compenso = null;
            $precontr->save();

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Annullamento rinuncia al compenso', 
                $precontr->insegn_id)
            ); 
            
        } catch(\Exception $e) {
            
            DB::rollback();
            throw $e;
        }
        DB::commit();  
        return Precontrattuale::where('insegn_id', $data['insegn_id'])->first();
    }


    /**
     *  $data lista di attachments
     *  $model istanza del modello a cui associare i file 
     */
    public function saveAttachments($data, $model, $emptyPermission = false){
        foreach ($data as $valore){ 
            
            //nel caso in cui esiste il valore id 
            //non c'è filename 
            //implica che va rimosso 
            if (array_key_exists('id',$valore) && !$valore['filename']){   
                $tmp = Attachment::find($valore['id']);
                if ($tmp){
                    $tmp->delete();
                }
            } else {            
                $saved = false;

                $valore['model_type'] = get_class($model);        
                $attachment = new Attachment($valore);        
                $attachment->model()->associate($model);
                if (array_key_exists('filevalue',$valore) && $attachment->loadStream($valore['filevalue']) != null ){                
                    $model->attachments()->save($attachment);                    
                    $saved = true;
                }else{                
                    if ($attachment->nrecord && $attachment->createLink($attachment->nrecord)){
                        $model->attachments()->save($attachment);
                        $saved = true;
                    } else{
                        if ($emptyPermission && $attachment->createEmptyFile()){
                            $model->attachments()->save($attachment);
                            $saved = true;
                        }                    
                    }
                }

                if (array_key_exists('id',$valore) && $saved){
                    $tmp = Attachment::find($valore['id']);
                    if ($tmp){
                        $tmp->delete();
                    }
                } 
            }
                        
        }
    }


}