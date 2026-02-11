<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\FindParameter;
use App\Personale;
use App\UnitaOrganizzativa;
use App\Ruolo;
use App\Organico;
class Dipartimento extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $connection = 'oracle';    

    public $table = 'V_IE_AC_DIPARTIMENTI';
    public $primaryKey = 'CD_DIP';

    /**
     * Scope a query to only include active dipartments.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDipartimenti($query)
    {
        return $query->where('DT_FINE_VAL', '>=',  Carbon::now())->select('cd_dip','nome_breve','dip_id','cd_miur','id_ab');
    }

    
    /**
     * restituisce tutto il personale afferente ad un dipartimento  
     *
     * @return Illuminate\Database\Eloquent\Relations\Relation
     */
    public function personale()
    {
        return $this->hasManyThrough(Personale::class, UnitaOrganizzativa::class, 'id_ab', 'aff_org','dip_id','uo');
    }
   
    /**
     * personale associato al dipartimento filtrato per tipo ruolo Ruolo::DOCENTITYPE (docenti)
     *
     * @return Builder
     */
    public function docenti()
    {
        return $this->personale()->whereHas('ruolo', function($ruolo){
            $ruolo->whereIn('tipo_ruolo', Ruolo::DOCENTITYPE);
        });        
    }

    public function organico()
    {
        return $this->hasMany(Organico::class, 'id_ab_uo', 'id_ab');
    }

    public function direttoreDipartimento()
    {
        return $this->organico()->valido()->respArea();        
    }

}
