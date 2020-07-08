<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\UnitaOrganizzativa;

class MappingRuolo extends Model
{
    protected $connection = 'mysql';    
    public $table = 'mappingruoli';

    protected $fillable = [
        'unitaorganizzativa_uo',
        'descrizione_uo',
        'v_ie_ru_personale_id_ab',
        'role_id',
    ];    
    
    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function role()
    {
        return $this->belongsTo('App\Role','role_id','id');
    }

    public function unitaorganizzativa()
    {
        return $this->belongsTo(UnitaOrganizzativa::class,'unitaorganizzativa_uo','uo');
    }    

}
