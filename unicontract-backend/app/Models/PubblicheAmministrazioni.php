<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class PubblicheAmministrazioni extends Model
{
    protected $table = 'table_rapporto_pa';
    protected $fillable = [
        'b4_rapp_pubbl_amm_id',
        'percentuale',
        'dal_giorno',
        'al_giorno',
        'data_aspettativa',
        'denominazione_pa',
        'cod_fisc_pa',
        'piva_pa',
        'comune_pa',
        'provincia_pa',
        'indirizzo_pa',
        'num_civico_pa',
        'cap_pa',
        'num_telefono_pa',
        'num_fax_pa',
        'email_pa',
        'pec_pa'      
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
   
}
