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
use App\Models\A2ModalitaPagamento;
use Exception;
use DB;
use App\Repositories\Events\RepositoryEntityCreated;
use Carbon\Carbon;
use App\Service\PrecontrattualeService;
use App\Audit;
use Illuminate\Support\Arr;

class A2ModalitaPagamentoRepository extends BaseRepository {
    /**
     * Specify Model class name
     *
     * @return mixed
     */
    function model()
    {
        return 'App\Models\A2ModalitaPagamento';
    }

    public function store(array $data){  
        DB::beginTransaction(); 
        try{

            $entity = new A2ModalitaPagamento();
            $entity->fill($data);
            $success = $entity->save();            
                        
            $newValue = Arr::only($entity->toArray(),Audit::$toTrace);
            $originalValue = Arr::only($data['originalValue'],Audit::$toTrace);            
            $diff = array_diff($newValue, $originalValue);
            $msg='';
            foreach ($diff  as $key => $value) {                      
                $audit = new Audit();
                $audit->field_name = $key;
                $audit->old_value = $originalValue[$key] ?: '';
                $audit->new_value = $value  ?: '';
                $entity->audit()->save($audit);
                Log::info('Variazione ['. $key .']');            
                $msg .= ' da '. $originalValue[$key].' a '. $value.';';           
            }            

            //se non ci sono state variazioni rilevate e l'originalvalue ha una variazione sull'iban
            //riportiamo questa variazione anche su questa entità
            if (count($diff)==0){                             
                if (array_key_exists('id',$data['originalValue']) && $data['originalValue']['id']){
                    $a2ModalitaPagamento = A2ModalitaPagamento::where('id', $data['originalValue']['id'])->first();                     
                    $originalAudit = $a2ModalitaPagamento->audit()->where('field_name','iban')->orderBy('id','desc')->first();                                    
                    if ($originalAudit){
                        //esiste una variazione nell'originale
                        $audit = new Audit();
                        $audit->field_name = 'iban';
                        $audit->old_value = $originalAudit->old_value;
                        $audit->new_value = $originalAudit->new_value;
                        $entity->audit()->save($audit);
                    }
                }
            }        

            $precontr = Precontrattuale::where('insegn_id', $data['insegn_id'])->first(); 
            $precontr->a2modalitapagamento()->associate($entity);                              
            $precontr->save();            

            $precontr->storyprocess()->save(
                PrecontrattualeService::createStoryProcess('Modello A.2: Importazione dati modalità di pagamento', 
                $data['insegn_id'])
            );  
            
            if (count($diff)>0){
                $precontr->storyprocess()->save(
                    PrecontrattualeService::createStoryProcess('Modello A.2: Variazione codice IBAN'.$msg, 
                    $data['insegn_id'])
                );  
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