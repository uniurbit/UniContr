<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Attachment;
use App\Precontrattuale;

class D1_Inps extends Model
{
    protected $table = 'd1_inps';
    protected $fillable = [
        'flag_obbligo_contributivo',
        'flag_gestione_separata',
        'flag_misura_ridotta',
        'flag_partita_iva',
        'specif_obbligo_contributivo',
        'specif_gestione_separata',
        'specif_misura_ridotta',
        'data_pensione',
        'cassa_gestioni_previdenziali'
    ];

    protected $casts = [
        'data_pensione' => 'datetime:d-m-Y',
    ];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'d1_inps_id','id');
    }

     /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataPensioneAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_pensione'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_pensione'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataPensioneAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
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
}
