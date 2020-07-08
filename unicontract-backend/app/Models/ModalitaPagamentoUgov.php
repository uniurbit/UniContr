<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Banche;

class ModalitaPagamentoUgov extends Model
{
    protected $connection = 'oracle';    
    protected $table = 'PAGAMENTI';
}
