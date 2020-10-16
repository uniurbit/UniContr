<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class InsegnamSegmentiUgov extends Model
{
    protected $connection = 'oracle';        
    protected $table = 'v_ie_di_af';     

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('Fetch', function ($builder) {
            $builder->select(['af_radice_id','sett_des','sett_cod']);
        });
    }


    public function scopeSeg($query)
    {
        return $query->where('tipo_comp_af_cod','SEG');
    }
}