<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Precontrattuale;
class C_PrestazioneProfessionale extends Model
{
    protected $table = 'c_prestaz_profess';
    protected $fillable = [
        'piva',
        'intestazione',
        'tipologia',
        'flag_albo',
        'denominazione_albo',
        'provincia_albo',
        'num_iscrizione_albo',
        'data_iscrizione_albo',
        'flag_cassa',
        'denominazione_cassa',
        'contributo_cassa',
        'flag_rivalsa',
        'flag_regime_fiscale'
    ];

    protected $casts = [
        'data_iscrizione_albo' => 'datetime:d-m-Y',
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'c_prestaz_profess_id','id');
    }

     /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataIscrizioneAlboAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_iscrizione_albo'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_iscrizione_albo'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataIscrizioneAlboAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }
}
