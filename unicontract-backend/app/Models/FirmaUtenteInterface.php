<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use DateTimeInterface;

interface FirmaUtenteInterface 
{
    public function getNomeProviderAttribute();
    public function getDescrizioneProviderAttribute();
    public function getIsContrattoCaricatoAttribute();
}