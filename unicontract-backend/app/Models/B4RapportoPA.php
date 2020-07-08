<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Attachment;
use App\Precontrattuale;
use App\Models\PubblicheAmministrazioni;

class B4RapportoPA extends Model
{
    protected $table = 'b4_rapp_pubbl_amm';
    protected $fillable = [
        'tipo_rapporto',
        'tempo_pieno',
        'iscrizione_albo',
        'descrizione_albo',
        'attivita_professionale',
        'descrizione_attivita'
    ];

    public function pubblamm()
    {
        return $this->hasMany(PubblicheAmministrazioni::class, 'b4_rapp_pubbl_amm_id', 'id');
    }

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'b4_rapp_pubbl_amm_id','id');
    }

     /**
     * Get the attachments relation morphed to the current model class
     *
     * @return MorphMany
     */
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'model')->AttachmentType();
    }


    public function tempoPienoToString() {
        if ($this->tempo_pieno === 0) {
          return 'parziale';
        } else {
          return 'pieno';
        }
      }
}
