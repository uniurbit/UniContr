<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
class D5_fiscali_estero extends Model
{
    protected $table = 'd5_fiscali_resid_estero';
    protected $fillable = [
        'flag_convenzione_bilaterale',
        'flag_gestione_separata'
    ];

    
    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d5_fiscali_resid_estero_id','id');
    }
}
