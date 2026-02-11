<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SendEmail extends Model
{
    public $table = 'table_sent_emails';
    protected $fillable = [
        'sender_user_id',
        'receiver_docente_id',
        'receiver',
        'codifica',
        'oggetto',       
        'corpo_testo',        
    ];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y',        
    ];
    
    protected $appends = ['time'];

    public function getTimeAttribute()
    {     
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->setTimezone(config('unidem.timezone'))->format('H:i');     
    }


    public function user()
    {              
        return $this->belongsTo(User::class,'sender_user_id','id');
    }   

     /**
     * Relationship: model
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function model()
    {
        return $this->morphTo();
    }
}
