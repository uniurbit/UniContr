<?php

namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;
use App\Candidato;
use App\Membro;
use App\Template;
use Carbon\Carbon;

class RegistroAttivita extends Model
{
    protected $connection = 'off';  

    protected $table = 'insegnamenti';

    private $tot = 0;

    protected $casts = [
        'durata_ore' => 'integer'
    ];

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('totale', function ($builder) {
            $builder->join('corsi as c', 'insegnamenti.ins_cdl1', '=', 'c.id')
                ->select(['ins_id','ins_aa','ins_cdl1','c.classe_ico','c.id_ugov','c.nome_specifico as nome_cdl','ins_nomecorso as nome_insegnamento', 'ins_ug_af_id as af_id', 'ins_periodo as periodo', 'ins_durata as durata_ore', 'ins_cfu as cfu', 'ins_DOCENTE1_ID as id_docente']);
        });
    }
    
    
    //insegnamenti.ins_aa = '2019/2020'  

    public function statusregistrolezioni()
    {
        return $this->hasMany(StatusRegistroLezioni::class, 'ins_id', 'ins_id');
    }

    public function lezioni()
    {
        return $this->hasMany(Lezione::class, 'ins_id', 'ins_id');
    }

    public function corso()
    {
        return $this->hasMany(Corso::class, 'ins_id', 'ins_id');
    }

    public function calcolaOre(){       
        foreach ($this->lezioni as $lezione) {
            $minutes = $lezione->diffInMinutes();
            if ($minutes!=null && $minutes>0){
                $this->tot = $this->tot + $minutes;
            }
        }
        return round($this->tot / 60, 2);
    }

    public function getNumOreAttribute(){
        if ($this->tot>0){
            return $this->tot;
        }
        return $this->calcolaOre();
    }


}