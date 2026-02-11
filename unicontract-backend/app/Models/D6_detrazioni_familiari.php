<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\FamiliariACarico;
use Carbon\Carbon;
use App\Precontrattuale;
class D6_detrazioni_familiari extends Model
{
    protected $table = 'd6_detraz_fam_carico';
    protected $fillable = [
        'flag_richiesta_detrazioni',
        'flag_coniuge_carico',
        'dal_giorno'
    ];

    protected $casts = [
        'dal_giorno' => 'datetime:d-m-Y'
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d6_detraz_fam_carico_id','id');
    }

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



    public function familiari()
    {
        return $this->hasMany(FamiliariACarico::class, 'd6_detraz_fam_carico_id', 'id');
    }
}
