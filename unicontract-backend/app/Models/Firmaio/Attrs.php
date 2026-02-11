<?php

namespace App\Models\Firmaio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attrs extends Model
{
    use HasFactory;

    protected $connection = null;  
    
    protected $fillable = [
        'coordinates', //x e y
        'page',
        'size', //w e h
    ];
            
}