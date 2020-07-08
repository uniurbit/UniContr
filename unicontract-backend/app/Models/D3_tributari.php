<?php

namespace App\Models;
use App\Models\RapportoEnti;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;

class D3_tributari extends Model
{
    protected $table = 'd3_tributari';
    protected $fillable = [
        'flag_percepito',
        'flag_limite_percepito'
    ];

    public function enti()
    {
        return $this->hasMany(RapportoEnti::class, 'd3_tributari_id', 'id');
    }

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d3_tributari_id','id');
    } 

}
