<?php

namespace App\Models\Ugov;

use Illuminate\Database\Eloquent\Model;

class CompensoUgov extends DGUgov
{
    protected $connection = 'oracle';    
    protected $table = 'V_IE_DG15_X_COMPENSO';

    protected $nome_tipo_dg = 'COMPENSO';

    static protected function getNomeTipoDgValue(){
        return  'COMPENSO';
    }

    public function relazionirate()
    {
        return $this->hasMany(RelazioneRateUgov::class, 'id_dg_ref_b', 'id_dg');
    }

    public function ordinativi()
    {
        return $this->hasManyThrough(
            PagamentoUgov::class, 
            RelazioniDgUgov::class, 
            'id_dg_1', 
            'id_dg',
            'id_dg',
            'id_dg_2'
        );
    }
}


