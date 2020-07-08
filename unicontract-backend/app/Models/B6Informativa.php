<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
class B6Informativa extends Model
{
    protected $table = 'b6_trattamento_dati';
    protected $fillable = [
        'flag1',
        'flag2'
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b6_trattamento_dati_id','id');
    }

}
