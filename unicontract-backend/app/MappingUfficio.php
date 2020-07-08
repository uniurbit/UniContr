<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\UnitaOrganizzativa;


//php artisan make:model MappingUfficio
class MappingUfficio extends Model
{
    
    protected $connection = 'mysql';    

    public $table = 'mappinguffici';

    protected $fillable = ['unitaorganizzativa_uo', 'descrizione_uo' ,'strutturainterna_cod_uff','descrizione_uff'];

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function unitaorganizzativa()
    {
        return $this->belongsTo(UnitaOrganizzativa::class,'unitaorganizzativa_uo','uo');
    }

}
