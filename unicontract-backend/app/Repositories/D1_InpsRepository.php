<?php namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use Illuminate\Support\Facades\Log;
use App\Models\D1_Inps;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Precontrattuale;

class D1_InpsRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\D1_Inps';
    }

    public function updateD1_Inps(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = D1_Inps::findOrFail($id); 
            $entity->update($data);                    
                
            //salvare allegati ...             
            if (array_key_exists('attachments',$data)){              
                $this->saveAttachments($data['attachments'], $entity);
            }

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
                    $tmp = Attachment::find($valore['id']);
                    if ($tmp){
                        $tmp->delete();
                    }
                } 
            }
                        
        }
    }

}