<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatoCivileUgov extends Model
{
    protected $connection = 'oracle';    
    protected $table = 'STATO_CIVILE';
}
