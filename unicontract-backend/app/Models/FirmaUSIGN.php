<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class FirmaUSIGN extends Model implements FirmaUtenteInterface
{
    //processo di firma
    use HasFactory;

    protected $table = 'processi_firma';
    protected $fillable = [
        'process_id',
        'process_name',
        'document_type',
        'assignee_email',
        'assignee_name',
        'rejections',
        'async',
        'stato',
        'step',
        'contenuto',
        'file_id',
        'link',
        'notify_assigned_user'
    ];

    protected $appends = ['nomeProvider','isContrattoCaricato','descrizioneProvider'];
    
    protected $hidden = ['contenuto'];

    protected $casts = [        
        'created_at' => 'datetime:d-m-Y',    
    ];

    public function getContenutoAttribute($value) 
    {
        // json_decode($value, false) ritorna una stdclass che poi viene convertita in json in questo modo [] --> {}
        return json_decode($value);
    }
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

    public function getNomeProviderAttribute(){
        return 'USIGN';
    }

    public function getDescrizioneProviderAttribute(){
         return 'U-Sign';
    }
    

    public function getIsContrattoCaricatoAttribute(){
        return $this->stato != 'rejected' && $this->link != null;
    }
}
