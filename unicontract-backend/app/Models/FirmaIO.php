<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use DateTimeInterface;

class FirmaIO extends Model implements FirmaUtenteInterface
{
    //richiesta di firma
    use HasFactory;

    protected $table = 'richieste_firma';
    protected $fillable = [
        'tipo',
        'signer_id',
        'dossier_id',
        'signature_request_id',
        'document_id',
        'contenuto',
        'stato',
        'documenti_caricati',
        'documenti_validati'
    ];

    protected $appends = ['nomeProvider','isContrattoCaricato', 'descrizioneProvider'];

    protected $hidden = ['document_id','signer_id','dossier_id','contenuto'];

    protected $casts = [        
        'created_at' => 'datetime:d-m-Y',    
    ];

    public function getContenutoAttribute($value) 
    {
        // json_decode($value, false) ritorna una stdclass che poi viene convertita in json in questo modo [] --> {}
        return json_decode($value);
    }

    // public function setContenutoAttribute($value) 
    // {
    //     $this->attributes['contenuto'] = json_encode($value);
    // }
    
    public function contratto()
    {
        return $this->belongsTo(Precontrattuale::class, 'precontr_id', 'id');
    }

     /**
     * Prepare a date for array / JSON serialization.
     *
     * @param  \DateTimeInterface  $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->setTimezone(config('unidem.timezone'));
    }

    // // Post.php // override the base Model function public function
    // newFromBuilder($attributes = array()) { 
    //     $class = 'Post'. ucwords($attributes->status); 
    //     $instance = new $class; $instance->exists = true;
    //     $instance->setRawAttributes((array) $attributes, true);
    //     return $instance; 
    // }

    public function getNomeProviderAttribute(){
        return 'FIRMAIO';
    }

    public function getDescrizioneProviderAttribute(){
        return 'Firma con IO';
    }
    
    public function getIsContrattoCaricatoAttribute(){
        return $this->stato != 'REJECTED' && $this->stato != 'DRAFT';
    }
}
