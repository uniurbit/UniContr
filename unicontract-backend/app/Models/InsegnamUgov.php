<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class InsegnamUgov extends Model
{
    protected $connection = 'oracle';        
    protected $table = 'V_IE_DI_COPER';

    protected $casts = [
        'data_ini_contratto' => 'date:d-m-Y',      
        'data_fine_contratto' => 'date:d-m-Y',        
    ];

    protected $appends = ['nominativo'];

    public function anagrafica() {
        return $this->hasOne(AnagraficaUgov::class, 'MATRICOLA', 'MATRICOLA');
    }

    public function getNominativoAttribute($input)
    {
        return $this->cognome.' '.$this->nome;
    }
}