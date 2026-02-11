<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;

class D4_fiscali extends Model
{
    protected $table = 'd4_fiscali';
    protected $fillable = [
        'percentuale_aliquota_irpef',
        'flag_detrazioni',
        'detrazioni',
        'reddito',
        'flag_bonus_renzi',
        'flag_detrazioni_21_2020',
        'detrazioni_21_2020',
        'reddito_21_2020'

    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d4_fiscali_id','id');
    }

}
