<?php

namespace App\Models\Firmaio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SignatureField extends Model
{
    use HasFactory;

    protected $connection = null;  
    
    protected $fillable = [
        'attrs',
        'clause'
    ];

    public function attrs()
    {
        return $this->hasOne(Attrs::class);
    }

    public function clause()
    {
        return $this->hasOne(Clause::class);
    }

    
}