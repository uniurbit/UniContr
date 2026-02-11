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
use App\Models\P2rapporto;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Service\PrecontrattualeService;

class P2RapportoRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\P2rapporto';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new P2rapporto();
            $entity->fill($data);
            $success = $entity->save();            
            
            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->p2naturarapporto()->associate($entity);      
            $precontr->save();

            //memorizzare story process
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello P.2: Compilazione dati Rapporto del collaboratore', 
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

}