<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
class B5StatoPensionamento extends Model
{
    protected $table = 'b5_stato_pensionam';
    protected $fillable = [
        'status',
        'flag_rapp_collab_universita'
    ];
    
    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b5_stato_pensionam_id','id');
    }
}
