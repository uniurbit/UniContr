<?php

namespace App\Models\Firmaio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SignatureRequest extends Model
{
    use HasFactory;

    protected $connection = null;  
    
    protected $fillable = [
        'dossier_id',
        'signer_id',
        'expires_at',
        'documents_metadata',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        //'documents_metadata' => 'array',
    ];

    public function documentsMetadata()
    {
        return $this->hasOne(DocumentMetadata::class);
    }
}