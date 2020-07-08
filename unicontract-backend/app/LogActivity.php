<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LogActivity extends Model
{
   /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'subject', 'url', 'method', 'ip', 'agent', 'user_id', 'request'
    ];

    protected $casts = [       
        'created_at' => 'datetime:d-m-Y H:m:s',
    ]; 
}
