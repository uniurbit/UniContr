<?php

namespace App\Models\Firmaio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocumentMetadata extends Model
{
    use HasFactory;

    protected $connection = null;  
    
    //minLength: 3
    //maxLength: 60
    protected $fillable = [
        'title',
        'signature_fields'
    ];

    public function signatureFields()
    {
        return $this->hasMany(SignatureField::class);
    }
}