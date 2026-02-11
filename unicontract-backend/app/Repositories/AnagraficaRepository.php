<?php namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use Illuminate\Support\Facades\Log;
use App\Models\Anagrafica;
use App\Precontrattuale;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Service\PrecontrattualeService;
use App\Audit;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Illuminate\Support\Arr;
class AnagraficaRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\Anagrafica';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new Anagrafica();
            $entity->fill($data);
            $success = $entity->save();            
            
            $docente = User::where('v_ie_ru_personale_id_ab', $data['id_ab'])->first();
            //salvare allegati ...             
            if (array_key_exists('attachments',$data)){              
                $this->saveAttachments($data['attachments'], $docente);
            }else{
                throw new Exception("Nessun file in allegato", 1);                
            }  

            //capire la variazione di modello rispetto a ugov o 
            //rispetto al dato in anagrafica precedentemente inserito            
            $newValue = Arr::only($entity->toArray(),Audit::$toTrace);
            $originalValue = Arr::only($data['originalValue'],Audit::$toTrace);
            $diff = array_diff($newValue, $originalValue);
            $msg ='';
            foreach ($diff  as $key => $value) {                      
                $audit = new Audit();
                $audit->field_name = $key;
                $audit->old_value = $originalValue[$key] ?: '';
                $audit->new_value = $value ?: '';
                $entity->audit()->save($audit);
                Log::info('Variazione ['. $key .']');  
                $msg .= ' da '. $originalValue[$key].' a '. $value.';';                               
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->anagrafica()->associate($entity);      
            $precontr->save();                 

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello A.1: Importazione dati anagrafici del collaboratore', 
                $data['insegn_id'])
            ); 

            if (count($diff)>0){
                $precontr->storyprocess()->save(
                    PrecontrattualeService::createStoryProcess('Modello A.1: Variazione dati di residenza'.$msg, 
                    $data['insegn_id'])
                );  
            }   
        }
        catch(\Exception $e)
        {
            $handler = new Handler(Container::getInstance());
            $handler->report($e);
            //failed logic here
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        return $entity;
    }

      /**
     *  $data lista di attachments
     *  $model istanza del modello a cui associare i file 
     */
    public function saveAttachments($data, $model, $emptyPermission = false){
        foreach ($data as $valore){ 
            $saved = false;

            $valore['model_type'] = get_class($model);        
            $attachment = new Attachment($valore);        
            $attachment->model()->associate($model);
            if (array_key_exists('filevalue',$valore) && $attachment->loadStream($valore['filevalue']) != null ){                
                $model->attachments()->save($attachment);
                $saved = true;
            }else{                
                if ($attachment->nrecord && $attachment->num_prot && $attachment->createLink($attachment->num_prot)){
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
                $attach = Attachment::find($valore['id']);
                if ($attach)
                    $attach->delete();
            } 
                        
        }
    }

}