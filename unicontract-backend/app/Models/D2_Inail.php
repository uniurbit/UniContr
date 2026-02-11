<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
class D2_Inail extends Model
{
    protected $table = 'd2_inail';
    protected $fillable = [
        'posizione_previdenziale'
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d2_inail_id','id');
    }

}
