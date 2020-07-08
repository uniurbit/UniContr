<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\AnagraficaUgov;

class RappParentelaUgov extends Model
{
    protected $connection = 'oracle';    
    protected $table = 'FAM_ANAGRAFICA';
}
