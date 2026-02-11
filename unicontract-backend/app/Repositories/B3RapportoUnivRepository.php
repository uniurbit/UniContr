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
use App\Models\B3RapportiStudio;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Models\B3joinRapporti;
use App\Service\PrecontrattualeService;

class B3RapportoUnivRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\B3RapportiStudio';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new B3RapportiStudio();
            $entity->fill($data['entity']);
            $success = $entity->save();
            
            if (array_key_exists('rapporti',$data['entity'])){
                foreach ($data['entity']['rapporti'] as $rapporto)
                {
                    $entity->rapporti()->save(new B3joinRapporti($rapporto));
                }
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->b3rapportoUniv()->associate($entity);      
            $precontr->save();           

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess("Modello B.3: Compilazione modello rapporto di studio o lavoro con l'Università",
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

    public function updateRapporto(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = B3RapportiStudio::findOrFail($id);                    
            $success = $entity->update($data);            
            
            $entity->rapporti()->delete();

            if (array_key_exists('rapporti',$data)){
                foreach ($data['rapporti'] as $rapporto)
                {
                    $entity->rapporti()->save(new B3joinRapporti($rapporto));
                }
            }            

            //$precontr = $entity->precontrattuale()->first();
            // $precontr->storyprocess()->save(
            //     PrecontrattualeService::createStoryProcess("Modello B.3: Modifica dati modello rapporto di studio o lavoro con l'Università", 
            //     $data['insegn_id'])
            // ); 
          
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
