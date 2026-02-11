<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Http\Controllers\Api\V1\QueryBuilder;
use App\Ruolo;
use App\UnitaOrganizzativa;

class PersonaleResponsOrg extends Model
{    

    const PERS_B = 'PERS_B';
    const PERS_C = 'PERS_C';
    const RESP_UFF = 'RESP_UFF';
    const COOR_PRO_D = 'COOR_PRO_D';
    const RESP_PLESSO = 'RESP_PLESSO';    

    protected $connection = 'oracle';    

    public $table = 'V_IE_RU_PERS_RESPONS_ORG';
    public $primaryKey = 'ID_AB';


    //public $selectcolumns = array('nome','cognome', 'id_ab', 'cd_tipo_posizorg','cd_csa', 'id_ab_resp', 'cd_tipo_posizorg_resp');

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('Fetch', function ($builder) {
            $builder->select(['nome','cognome', 'id_ab', 'cd_tipo_posizorg', 'cd_csa', 'id_ab_resp', 'cd_tipo_posizorg_resp','nome_resp', 'cognome_resp']);
        });
    }
  
    
    public function unita()
    {
        return $this->belongsTo(UnitaOrganizzativa::class,'cd_csa','uo');
    }
  
    public function mappingufficio()
    {
        return $this->belongsTo(MappingUfficio::class,'cd_csa','unitaorganizzativa_uo');
    } 

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have. 
    public function responsabile()
    {
        return $this->belongsTo(Personale::class,'id_ab_resp','id_ab');
    }


    //public function scopeFindByEmail($query, $email)
    //{        
    //    return $query->where('email',$email)->first();
    //}

    public function scopeFindByAfferenzaOrganizzativa($query, $uo)
    {        
        return $query->where('cd_csa',$uo);
    }

    public function scopeRespons($query)
    {        
        return $query->whereIn('cd_tipo_posizorg', array(PersonaleResponsOrg::RESP_UFF, PersonaleResponsOrg::COOR_PRO_D, PersonaleResponsOrg::RESP_PLESSO));
    }



    /** restituisce il nome del responsabile ricercabile su titulus */
    public function getNomepersonaAttribute(){
        return strtolower($this->attributes['cognome_resp']).' '.strtolower($this->attributes['nome_resp']);
    }

    /** restituisce il nome utente ricercabile su titulus */
    public function getUtenteNomepersonaAttribute(){
        return strtolower($this->attributes['cognome']).' '.strtolower($this->attributes['nome']);
    }
}