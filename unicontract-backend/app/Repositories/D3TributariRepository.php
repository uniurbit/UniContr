<?php 
namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use App\Repositories\Repository;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use App\Precontrattuale;
use Illuminate\Support\Facades\Log;
use App\Models\D3_tributari;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Models\RapportoEnti;


class D3TributariRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\D3_tributari';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new D3_tributari();
            $entity->fill($data['entity']);
            $success = $entity->save();
            
            if ($entity->flag_limite_percepito == 1){
                if (array_key_exists('enti',$data['entity'])){
                    foreach ($data['entity']['enti'] as $ente)
                    {
                        $entity->enti()->save(new RapportoEnti($ente));
                    } 
                }
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->d3tributari()->associate($entity);      
            $precontr->save();
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

    public function updateTributari(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = D3_tributari::findOrFail($id);                    
            $success = $entity->update($data);            
            
            $entity->enti()->delete();
            
            if ($entity->flag_limite_percepito == 1){
                if (array_key_exists('enti',$data)){
                    foreach ($data['enti'] as $ente)
                    {
                        $entity->enti()->save(new RapportoEnti($ente));
                    }
                }
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

}
