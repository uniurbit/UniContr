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
use App\Models\B1ConflittoInteressi;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Models\Carica;
use App\Models\Incarico;
use App\Service\PrecontrattualeService;


class B1ConflittoInteressiRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\B1ConflittoInteressi';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new B1ConflittoInteressi();
            $entity->fill($data);
            $success = $entity->save();
            
            if (array_key_exists('cariche',$data)){
                foreach ($data['cariche'] as $carica)
                {
                    $entity->cariche()->save(new Carica($carica));
                }
            }
            
            if (array_key_exists('incarichi',$data)){
                foreach ($data['incarichi'] as $incarico)
                {
                    $entity->incarichi()->save(new Incarico($incarico));
                }
            }

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->b1conflittointeressi()->associate($entity);      
            $precontr->save();

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.1: Compilazione modello dichiarazione sul conflitto di interessi', 
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

    public function updateConflitto(array $data, $id){  
        DB::beginTransaction(); 
        try{

            $entity = B1ConflittoInteressi::findOrFail($id);                    
            $success = $entity->update($data);            
            
            $entity->cariche()->delete();

            if (array_key_exists('cariche',$data)){
                foreach ($data['cariche'] as $carica)
                {
                    $entity->cariche()->save(new Carica($carica));
                }
            }

            $entity->incarichi()->delete();

            if (array_key_exists('incarichi',$data)){
                foreach ($data['incarichi'] as $incarico)
                {
                    $entity->incarichi()->save(new Incarico($incarico));
                }
            }
          
            $precontr = $entity->precontrattuale()->first();
            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello B.1: Modifica dati modello dichiarazione sul conflitto di interessi', 
                $precontr->insegn_id)
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