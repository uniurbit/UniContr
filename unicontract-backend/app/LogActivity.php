<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

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
        'created_at' => 'datetime:d-m-Y H:i:s',
    ]; 
     
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
}
