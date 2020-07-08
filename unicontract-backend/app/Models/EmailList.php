<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailList extends Model
{
    protected $table = 'table_sent_emails';
    protected $fillable = [
        'model_type',
        'model_id',
        'sender_user_id',
        'receiver_docente_id',
        'receiver',
        'codifica',
        'oggetto',
        'corpo_testo',
        'group_id'
    ];
}
