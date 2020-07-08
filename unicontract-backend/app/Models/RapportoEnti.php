<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class RapportoEnti extends Model
{
    protected $table = 'table_rapporto_enti';
    protected $fillable = [
        'ente',
        'rapporto',
        'dal_giorno',
        'al_giorno',
        'importo_totale',
        'importo_annuo'        
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


    public function caricaString(){
        return "ENTE: ".$this->ente."\nNATURA INCARICO/RAPPORTO: ".$this->rapporto."\nDAL GIORNO".$this->dal_giorno." AL GIORNO".$this->al_giorno.
        "\nIMPORTO TOTALE: € ".$this->importo_totale."\nIMPORTO ANNUO: € ".$this->importo_annuo;
    }
}
