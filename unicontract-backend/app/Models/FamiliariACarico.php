<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class FamiliariACarico extends Model
{
    protected $table = 'table_familiari_a_carico';
    protected $fillable = [
        'nome',
        'cognome',
        'parentela',
        'flag_disabilita',
        'cod_fiscale',
        'data_nascita',
        'percentuale_detrazione'
    ];

    protected $casts = [
        'data_nascita' => 'datetime:d-m-Y'
    ];

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataNascitaAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_nascita'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_nascita'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataNascitaAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }
}
