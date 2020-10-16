<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\InsegnamSegmentiUgov;

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

    public function segmenti() {
        return $this->hasMany(InsegnamSegmentiUgov::class, 'af_radice_id', 'af_radice_id')->Seg();
    }

    public function getSettDesAttribute($value){        
        if ($value==null){
            if ($this->segmenti() != null && $this->segmenti()->count()>0){
                return implode('; ', $this->segmenti->pluck('sett_des')->toArray());
            }            
        }
        return $value;
    }
    
    public function getSettCodAttribute($value){
        if ($value==null){
            if ($this->segmenti() != null && $this->segmenti()->count()>0){
                return implode('; ', $this->segmenti->pluck('sett_cod')->toArray());
            }            
        }
        return $value;
    }

}