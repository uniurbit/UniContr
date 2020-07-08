<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class B3joinRapporti extends Model
{
    protected $table = 'table_rapporto_univ';
    protected $fillable = [
        'b3_rapp_studio_univ_id',
        'universita',
        'dipartimento',
        'dal_giorno',
        'al_giorno',
        'tipologia_rapporto',
        'riferimenti_legge'
    ];

    //emission_data è la data di protocollazione
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

    



}
