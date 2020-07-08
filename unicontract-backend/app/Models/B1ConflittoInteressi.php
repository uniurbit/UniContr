<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Incarico;
use App\Models\Carica;
use App\Precontrattuale;
use Carbon\Carbon;
class B1ConflittoInteressi extends Model
{
    protected $table = 'b1_confl_interessi';
    protected $fillable = [
        'flag_controll',
        'flag_quota',
        'flag_rappext',
        'flag_contrast',
        'flag_cariche',
        'flag_incarichi',
        'flag_attivita',
        'descr_attivita'
    ];
    
    protected $appends = ['createdDate'];
    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function cariche()
    {
        return $this->hasMany(Carica::class, 'b1_confl_interessi_id', 'id');
    }

    public function incarichi()
    {
        return $this->hasMany(Incarico::class, 'b1_confl_interessi_id', 'id');
    }

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b1_confl_interessi_id','id');
    }

    public function getCreatedDateAttribute(){
        if (array_key_exists('createdDate', $this->attributes) && $this->attributes['createdDate']!=null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['createdDate'])->setTimezone(config('unidem.timezone'))->format('Y-m-d H:i:s');
        }
        return null;
    }
}
