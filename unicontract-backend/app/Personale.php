<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Http\Controllers\Api\V1\QueryBuilder;
use App\Ruolo;
use App\UnitaOrganizzativa;
use App\MappingUfficio;

class Personale extends Model
{    

    protected $connection = 'oracle';    

    public $table = 'V_IE_RU_PERSONALE';
    public $primaryKey = 'ID_AB';

    public $selectcolumns = array('nome','cognome', 'matricola', 'aff_org', 'email','cd_ruolo'. 'id_ab','cod_fis');

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('Fetch', function ($builder) {
            $builder->select(['nome','cognome', 'matricola', 'aff_org', 'email','cd_ruolo', 'V_IE_RU_PERSONALE.id_ab as id_ab','cod_fis']);
        });
    }

    public function ruolo()
    {
        return $this->belongsTo(Ruolo::class,'cd_ruolo','ruolo');
    }

    public function unita()
    {
        return $this->belongsTo(UnitaOrganizzativa::class,'aff_org','uo');
    }    

    public function mappingufficio()
    {
        return $this->belongsTo(MappingUfficio::class,'aff_org','unitaorganizzativa_uo');
    } 


    public function scopeFindByIdAB($query, $id_ab)
    {        
        return $query->where('id_ab',$id_ab)->first();
    }

    
    /**
     * scopeFindByEmail restituisce una persona cercandola dalla sua email
     *
     * @param  mixed $query
     * @param  mixed $email
     * @return Personale 
     */
    public function scopeFindByEmail($query, $email)
    {        
        return $query->where('email',$email)->first();
    }

    public function isDocente()
    {
        return $this->ruolo->isDocente();
    }

    public function isPta()
    {
        return $this->ruolo->isPta();
    }
    
    public function scopeFindByAfferenzaOrganizzativa($query, $uo)
    {        
        return $query->where('aff_org',$uo);
    }
}
