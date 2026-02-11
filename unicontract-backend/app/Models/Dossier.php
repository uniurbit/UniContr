<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dossier extends Model
{
    use HasFactory;

    protected $table = 'dossiers';
    protected $fillable = [
        'dossier_id',
        'titolo',
        'attivo',
    ];

}
