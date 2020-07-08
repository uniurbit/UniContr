<?php namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use Illuminate\Support\Facades\Log;
use App\Models\B4RapportoPA;
use App\Models\PubblicheAmministrazioni;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Precontrattuale;
use App\Service\PrecontrattualeService;
use Storage;
class B4RapportoPARepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\B4RapportoPA';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new B4RapportoPA();
            $entity->fill($data['entity']);
            /*
            $entity->fill($data);
            */
            $success = $entity->save();  
            
            // join table_rapporto_pa
            if (array_key_exists('pubblamm',$data['entity'])){
                foreach ($data['entity']['pubblamm'] as $pubblamm)
                {
                    $entity->pubblamm()->save(new PubblicheAmministrazioni($pubblamm));
                } 
            }
                
            //salvare allegati ...             
            if (array_key_exists('attachments',$data['entity'])){              
                $this->saveAttachments($data['entity']['attachments'], $entity);
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->b4rapportopa()->associate($entity);      
            $precontr->save();
            
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.4: Compilazione modello rapporto di lavoro con la P.A.', 
                $data['insegn_id'])
            ); 
        }
        catch(\Exception $e)
        {
            //failed logic here
            DB::rollback();
            throw $e;
        }
        DB::commit();       
        return $entity;
    }


    public function updateRapp(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = B4RapportoPA::findOrFail($id); 
            $entity->update($data);    

            $entity->pubblamm()->delete();
            
            if (array_key_exists('pubblamm',$data)){
                foreach ($data['pubblamm'] as $pubblamm)
                {
                    $entity->pubblamm()->save(new PubblicheAmministrazioni($pubblamm));
                }
            }
                
            //salvare allegati ...             
            if (array_key_exists('attachments',$data)){              
                $this->saveAttachments($data['attachments'], $entity);
            }          

            $precontr = $entity->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.4: Modifica dati modello rapporto di lavoro con la P.A.', 
                $data['insegn_id'])
            ); 

        }
        catch(\Exception $e)
        {
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
            // $copy = false;
            // if (array_key_exists('id',$valore) && $valore['filename'] && !array_key_exists('filevalue',$valore)){
            //     //va eseguita una lettura del file value
            //     $attach = Attachment::find($valore['id']);
            //     $valore['filevalue'] = base64_encode(Storage::get($attach->filepath));            
            //     //sto eseguendo una copia                
            //     $copy=true;
            // } 

            //nel caso in cui esiste il valore id 
            //non c'è filename 
            //implica che va rimosso           
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

            if (array_key_exists('id',$valore) && $saved && $valore['id']){   
                Attachment::find($valore['id'])->delete();
            }                 
        }
    }

}