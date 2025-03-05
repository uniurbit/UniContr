<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Http\Controllers\Api\V1\QueryBuilder;
use App\Dipartimento;
use App\Organico;
use App\Personale;
use App\Service\RoleService;

class UnitaOrganizzativa extends Model
{
    protected $connection = 'oracle';    

    public $table = 'VISTA_ORG_ATTIVA';
    public $primaryKey = 'ID_AB';

    protected $dates = [        
        'data_fin'        
    ];

    protected $casts = [
        'data_fin' => 'datetime:d-m-Y',
    ];
      
     public function dipartimento()
     {
        return $this->belongsTo(Dipartimento::class,'id_ab','dip_id');        
     }

     public function isUnitaAdmin(){
        
        if (in_array($this->uo, config('unidem.unitaAdmin')))
            return true;

        return false;
     }

    public function scopeUfficiValidazione($query){
         return $query->whereIn('uo', config('unidem.ufficiPerValidazione'));
    }

     //restituisce tutto il personale afferente ad una unità organizzativa (foglia)
     public function organico()
     {
         return $this->hasMany(Organico::class, 'id_ab_uo',  'id_ab');         
     }

     //con email
     public function personale()
     {
         return $this->hasMany(Personale::class, 'aff_org',  'uo');         
     }
 
     /**
      * isInternalPlesso ritorna true se l'unità organizzativa corrente è un plesso
      *
      * @return Boolean
      */
      public function isInternalPlesso(){
        return $this->tipo == 'PLD';
     }

      
     /**
      * isPlesso ritorna true se l'unità organizzativa corrente è un plesso o è all'interno di un plesso
      *
      * @return Boolean
      */
     public function isPlesso(){
        if ($this->isInternalPlesso()){
            return $this->isInternalPlesso();
        } else {
            $padre = $this->padre()->first();
            if ($padre){
                return $padre->isInternalPlesso();
            }                  
        }       
        return false;       
     }
     
     /**
      * isDipartimento ritorna true se l'unità organizzativa corrente è un dipartimento
      *
      * @return Boolean
      */
     public function isDipartimento(){
        return $this->tipo == 'DIP';
     }
         
     public function padre()
     {
         return $this->hasMany(UnitaOrganizzativa::class, 'uo',  'uo_padre');         
     }
 
    public function dipartimenti(){
        if ($this->isInternalPlesso()){
           return $this->listaDipartimenti($this->id_ab);
        } else {
            $padre = $this->padre()->first();
            if ($padre && $padre->isInternalPlesso()){
                return $this->listaDipartimenti($padre->id_ab);
            }
            return [$this->uo];
        }
    }


    private function listaDipartimenti($id_ab)
    {
            //Plesso Economico - Umanistico (DESP-DISTUM)
            if ($id_ab == 26618){
                return ['004424','004939'];
            }
            //Plesso Giuridico-Umanistico (DIGIUR-DISCUI)
            if ($id_ab == 26616){
                return ['004419','005579'];
            }
            //Plesso Scientifico (DiSPeA-DiSB)
            if ($id_ab == 32718){
                return ['004919','005019'];
            }         
            //Plesso Umanistico (DISTUM)
            if ($id_ab == 120524){
                return ['004939'];
            }
            //Plesso Economico (DESP)
            if ($id_ab == 120525){
                return ['004424'];
            }
    
            return [];  
    }
  

    public static function allDipartimenti(){
        return ['004424','004939','004419','004940','004919','005019'];
    }

}
