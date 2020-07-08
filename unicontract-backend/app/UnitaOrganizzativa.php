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
      * isPlesso ritorna true se l'unità organizzativa corrente è un plesso
      *
      * @return Boolean
      */
     public function isPlesso(){
        return $this->tipo == 'PLD';
     }
     
     /**
      * isDipartimento ritorna true se l'unità organizzativa corrente è un dipartimento
      *
      * @return Boolean
      */
     public function isDipartimento(){
        return $this->tipo == 'DIP';
     }
         
    /**
     * restituisce un array dei dipartimenti 
     * che afferiscono all'unità organizzativa corrente.
     *
     * @return Array
     */
    public function dipartimenti(){
        if ($this->isPlesso()){
            //Plesso Economico - Umanistico (DESP-DISTUM)
            if ($this->id_ab == 26618){
                return ['004424','004939'];
            }
            //Plesso Giuridico-Umanistico (DIGIUR-DISCUI)
            if ($this->id_ab == 26616){
                return ['004419','004940','005579'];
            }
            //Plesso Scientifico (DiSPeA-DiSB)
            if ($this->id_ab == 32718){
                return ['004919','005019'];
            }     
            //... aggiungere ulteriori associazioni      
        }
    }

    public static function allDipartimenti(){
        return ['004424','004939','004419','004940','004919','005019'];
    }

}
