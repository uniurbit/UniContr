<?php


namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;

class CorsoDiStudio extends Model
{
    protected $connection = 'off';  
    protected $table = 'corsi';
    //protected $table = 'corsi_di_studio';

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('totale_corsi', function ($builder) {
            $builder->with('scuola')->select(['id','id_ugov','aa','nome_specifico','app_dip','app_scuola','app_plesso']);
        });
    }

    public function scuola()
    {
        return $this->belongsTo(Scuola::class, 'app_scuola', 'scuola_id');
    }

    public function dipartimento()
    {
        return $this->belongsTo(Dipartimento::class, 'app_dip', 'dip_id');
    }

    public function scopeAnnoAccademico($query, $perirodoInizio)
    {
        return $query->where('aa', ($perirodoInizio.'/'.($perirodoInizio+1)));
    }
    

}
