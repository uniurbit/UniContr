<?php

namespace App\Models\Ugov;

use Illuminate\Database\Eloquent\Model;

abstract class DGUgov extends Model
{
    protected $connection = 'oracle';        

    protected $nome_tipo_dg = null;

    abstract static protected function getNomeTipoDgValue();

    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('datibase', function($builder) {
            $builder->with(['datibase'])->whereHas('datibase', function ($query) {
                $query->where('nome_tipo_dg','=',static::getNomeTipoDgValue());
            });
        });
    }

    public function datibase()
    {
        return $this->hasOne(DatiBaseDGUgov::class, 'id_dg', 'id_dg')
                    ->select('id_dg','stato_dg','anno_rif','ds_dg','num_registrazione','dt_registrazione','dt_annullamento','nome_tipo_dg');
                    
    }
   
    
    
}


