<?php

namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;
use App\Candidato;
use App\Membro;
use App\Template;
use Carbon\Carbon;

class Lezione extends Model
{
    protected $connection = 'off';  
    protected $table = 'lezioni';

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('totale', function ($builder) {
            $builder->select(['id','ins_id','data','ora_inizio','ora_fine','argomento','osservazioni']);
        });
    }

    //Carbon::createFromFormat('H:i', $data['monday_start']);
    public function getOraInizioAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('H:i:s', $input);
        }else{
            return null;
        }
    }

    public function getOraFineAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('H:i:s', $input);
        }else{
            return null;
        }
    }

    public function diffInMinutes()
    {
        if ($this->ora_fine!=null && $this->ora_inizio!=null){
            return $this->ora_fine->diffInMinutes($this->ora_inizio);
        }
        return null;
    }
}