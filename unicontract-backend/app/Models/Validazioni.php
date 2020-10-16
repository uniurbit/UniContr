<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Precontrattuale;
use Brexis\LaravelWorkflow\Traits\WorkflowTrait;
use App\Audit;

class Validazioni extends Model
{
    use WorkflowTrait;

    //flag_upd isValidatoAmm uff. amministrativo
    //flag_amm  isValidatoEconomica uff. finanze

    protected $table = 'table_validation';
    protected $fillable = [
        'insegn_id',
        'flag_submit',
        'date_submit',
        'flag_upd',
        'date_upd',
        'flag_amm',
        'date_amm',
        'flag_make',
        'date_make',
        'flag_accept',
        'date_accept',
    ];

    protected $casts = [
        'date_submit' => 'datetime:d-m-Y H:i:s',
        'date_upd' => 'datetime:d-m-Y H:i:s',
        'date_amm' => 'datetime:d-m-Y H:i:s',
        'date_make' => 'datetime:d-m-Y H:i:s',
        'date_accept' => 'datetime:d-m-Y H:i:s',
    ];

    protected $appends = ['blocked'];


    public function precontrattuale()
    {        
        //per compatibilità
        return $this->hasOne(Precontrattuale::class,'insegn_id','insegn_id');
    }

    /**
     * Get the audit relation morphed to the current model class
     *
     * @return MorphMany
     */
    public function audit()
    {
        return $this->morphMany(Audit::class, 'model');
    }

     /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateSubmitAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_submit'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_submit'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateSubmitAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateUpdAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_upd'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_upd'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateUpdAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateAmmAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_amm'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_amm'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateAmmAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateMakeAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_make'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_make'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateMakeAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateAcceptAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_accept'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_accept'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateAcceptAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    public function isBlocked(){
        return $this->isBlockedAmministrativa() && $this->flag_amm;
    }

    public function isBlockedAmministrativa() {
        return $this->flag_submit && $this->flag_upd;
    }

    public function getBlockedAttribute()
    {
        return $this->flag_submit && $this->flag_upd && $this->flag_amm;
    }


    public function dateSubmitToPrint(){
       return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['date_submit'])->setTimezone(config('unidem.timezone'))->format('d/m/Y');
    }
}
