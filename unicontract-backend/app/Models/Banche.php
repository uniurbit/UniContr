<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banche extends Model
{
    protected $connection = 'oracle'; 
    protected $table = 'BANCHE';
}
