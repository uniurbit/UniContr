<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Docente extends Model
{
    protected $table = 'users';
    protected $fillable = [
        'v_ie_ru_personale_id_ab',
        'name',
        'email',
        'password',
        'cf',
        'nome',
        'cognome'
    ];
}
