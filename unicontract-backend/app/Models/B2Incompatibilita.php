<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
class B2Incompatibilita extends Model
{
    protected $table = 'b2_incompatibilita';
    protected $fillable = [
        'flag_incompatibilita'
    ];

    
    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b2_incompatibilita_id','id');
    }
}
