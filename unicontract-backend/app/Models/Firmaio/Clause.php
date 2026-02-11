<?php

namespace App\Models\Firmaio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clause extends Model
{
    use HasFactory;

    protected $connection = null;  

    protected $fillable = [
        'title',
        'type',
    ];
    
}