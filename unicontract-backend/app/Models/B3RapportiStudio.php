<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\B3joinRapporti;
use App\Precontrattuale;
class B3RapportiStudio extends Model
{
    protected $table = 'b3_rapp_studio_univ';
    protected $fillable = [
        'flag_rapporto_universita'
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b3_rapp_studio_univ_id','id');
    }
    
    public function rapporti()
    {
        return $this->hasMany(B3joinRapporti::class, 'b3_rapp_studio_univ_id', 'id');
    }

    
}
