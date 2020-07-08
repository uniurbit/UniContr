<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TitulusRef extends Model
{
    protected $table = 'table_titulus_ref';
    protected $fillable = [
        'physdoc',
        'nrecord',
        'num_protocollo',
        'num_repertorio',        
        'bozza',
        'signed'
    ];
}
