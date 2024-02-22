<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use App\Audit;
use Carbon\Carbon;
class A2ModalitaPagamento extends Model
{
    protected $table = 'a2_mod_pagamento';
    protected $fillable = [
        'modality',
        'tipologia_conto_corrente',
        'iban',
        'bic',
        'denominazione',
        'luogo',
        'intestazione',
        'aba',
        'soluzione_pagamento'
    ];

    protected $appends = ['createdDate'];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'a2_mod_pagamento_id','id');
    }

    public function audit()
    {
        return $this->morphMany(Audit::class, 'model');
    }


    public function getCreatedDateAttribute(){
        if (array_key_exists('createdDate', $this->attributes) && $this->attributes['createdDate']!=null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['createdDate'])->setTimezone(config('unidem.timezone'))->format('Y-m-d H:i:s');
        }
        return null;
    }
}
