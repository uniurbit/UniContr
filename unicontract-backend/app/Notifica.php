<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Auth;
use Carbon\Carbon;


class Notifica extends Model
{

    public const PRIMARIO     = 'primario';     //primary
    public const SECONDARIO   = 'secondario';   //secondary
    public const SUCCESSO     = 'successo';     //sucess
    public const ATTENZIONE   = 'attenzione';   //danger
    public const EVIDENZA     = 'evidenza';     //warning
    public const INFO         = 'info';         //info
    public const CHIARO       = 'chiaro';       //light
    public const SCURO        = 'scuro';        //dark

    protected $connection = 'mysql';    

    public $table = 'notifiche';

    protected $fillable = [
        'messaggio',         
        'priorita', //primario, secondario, sucesso, attenzione, evidenza, info, chiaro, scuro
        'riferimento', //contratto
        'data_inizio',
        'data_fine',
        'dati',
        'stato',
        'tipo_vincolo'
    ];

    protected $casts = [
        'created_at' => 'date:d-m-Y',        
    ];

    public function getDatiAttribute($value) 
    {
       //ritorna una stdclass che poi viene convertita in json in questo modo [] --> {}
       return json_decode($value, false);
    }

    public function setDatiAttribute($value) 
    {
        $this->attributes['dati'] = json_encode($value,JSON_FORCE_OBJECT);
    }


    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataInizioAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataInizioAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_inizio'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_inizio'] = null;
        }
    }

        /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataFineAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataFineAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_fine'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_fine'] = null;
        }
    }

}
