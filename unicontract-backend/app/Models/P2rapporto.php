<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use Carbon\Carbon;

class P2rapporto extends Model {
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'p2_natura_rapporto';
    

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'p2_natura_rapporto_id','id');
    }
    
    protected $fillable = [
        'flag_rapp_studio_univ',
        'flag_dipend_pubbl_amm',
        'flag_titolare_pensione',
        'natura_rapporto'
    ];
    protected $appends = ['createdDate'];

    public function rsuToString(){
        if($this->flag_rapp_studio_univ == 1) { 
            return "A) Ha rapporti di studio con Università";
        } else {
            return "A) Non ha rapporti di studio con Università";
        }
    }

    public function dpaToString(){
        if($this->flag_dipend_pubbl_amm) { 
            return "B) E' dipendente di Pubblica Amministrazione";
        } else {
            return "B) Non è dipendente di Pubblica Amministrazione";
        }
    }

    public function tpToString(){
        if($this->flag_titolare_pensione == 1) { 
            return "C) E' titolare di pensione";
        } else {
            return "C) Non è titolare di pensione";
        }
    }
    public function naturaRapportoToString() {                    

        if ($this->natura_rapporto){
            if ($this->natura_rapporto === 'PRPR') {
                return 'Prestazione Professionale';
            } else if ($this->natura_rapporto === 'COCOCO') {
                return 'Collaborazione di Natura Autonoma';
            } else if ($this->natura_rapporto === 'PLAO') {
                return 'Prestazione di Lavoro Autonomo Occasionale';
            } else if ($this->natura_rapporto === 'PTG') {
                return 'Prestazione a Titolo Gratuito';
            } else if ($this->natura_rapporto === 'ALD') {
                return 'Assimilato a Lavoro Dipendente';
            } else {
                return 'Non definito';
            }
        }else {
            return 'Non definito';
        }
      }

      public function getCreatedDateAttribute(){
        if (array_key_exists('createdDate', $this->attributes) && $this->attributes['createdDate']!=null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['createdDate'])->setTimezone(config('unidem.timezone'))->format('Y-m-d H:i:s');
        }
        return null;
    }

}