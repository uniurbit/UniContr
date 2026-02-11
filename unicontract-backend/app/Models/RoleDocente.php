<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleDocente extends Model
{
    protected $table = 'model_has_roles';
    public $timestamps = false;
    protected $fillable = [
        'role_id',
        'model_type',
        'model_id'
    ];
}
