<?php 
namespace App\Repositories;
 
use App\Repositories\Events\RepositoryEntityUpdated;
use App\Repositories\RepositoryInterface;
use Illuminate\Support\Facades\Auth;
use App\Attachment;
use App\User;
use App\Precontrattuale;
use Illuminate\Support\Facades\Log;
use App\Models\D6_detrazioni_familiari;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Models\FamiliariACarico;


class D6_FamiliariRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\D6_detrazioni_familiari';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new D6_detrazioni_familiari();
            $entity->fill($data['entity']);
            $success = $entity->save();
            if ($entity->flag_richiesta_detrazioni) {
                if (array_key_exists('familiari',$data['entity'])){
                    foreach ($data['entity']['familiari'] as $familiare)
                    {
                        $entity->familiari()->save(new FamiliariACarico($familiare));
                    }
                }
            }
            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->d6familiari()->associate($entity);      
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

    public function updateFamiliare(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = D6_detrazioni_familiari::findOrFail($id);                    
            $success = $entity->update($data);            
            
            $entity->familiari()->delete();
            if ($entity->flag_richiesta_detrazioni) {
                if (array_key_exists('familiari',$data)){
                    foreach ($data['familiari'] as $familiare)
                    {
                        $entity->familiari()->save(new FamiliariACarico($familiare));
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
