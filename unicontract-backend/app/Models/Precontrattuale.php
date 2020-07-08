<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Precontrattuale extends Model
{
    protected $table = 'precontr';
   
    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateSubmitAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateUpdAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateAmmAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateMakeAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateAcceptAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateAnnullamentoAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateFlagNoCompensoAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function toLocalTimezone($input){
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }
   
}
