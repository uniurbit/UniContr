<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Incarico extends Model
{
    protected $table = 'table_incarichi';
    protected $fillable = [
        'ente',
        'incarico',
        'oggetto',
        'dal_giorno',
        'al_giorno',
        'compenso',        
    ];

    protected $casts = [
        'dal_giorno' => 'datetime:d-m-Y',
        'al_giorno' => 'datetime:d-m-Y',
    ];

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDalGiornoAttribute($input)
    {
        if($input != '') {
            $this->attributes['dal_giorno'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['dal_giorno'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDalGiornoAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setAlGiornoAttribute($input)
    {
        if($input != '') {
            $this->attributes['al_giorno'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['al_giorno'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getAlGiornoAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }

    
    public function incaricoString(){
        return "ENTE: ".$this->ente."\nTIPOLOGIA DELL'INCARICO: ".$this->carica."\nOGGETTO: ".
            $this->oggetto."\nDURATA: DAL ".$this->dal_giorno." AL ".$this->al_giorno."\nCOMPENSO LORDO ANNUO: euro ".$this->compenso;
    }

}
