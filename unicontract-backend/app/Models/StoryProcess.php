<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class StoryProcess extends Model
{
    protected $table = 'table_story_process';
    protected $fillable = [
        'insegn_id',
        'descrizione',
        'user_id'
    ];

    protected $casts = [
        'created_at' => 'date:d-m-Y',        
    ];
  
    protected $appends = ['time'];

    public function getTimeAttribute()
    {     
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->created_at)->setTimezone(config('unidem.timezone'))->format('H:i');     
    }

}
