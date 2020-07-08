<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use Carbon\Carbon;

class E_AutonomoOccasionale extends Model
{
    protected $table = 'e_autonomo_occasion';
    protected $fillable = [
        'cod_limite_reddito',
        'gestione_separata',
        'importo',
        'previdenza',
        'cod_cassa_previdenziale'
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class, 'e_autonomo_occasionale_id', 'id');
    }
}
