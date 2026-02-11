<?php

namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;
use App\Candidato;
use App\Membro;
use App\Template;
use Carbon\Carbon;

class StatusRegistroLezioni extends Model
{
    protected $connection = 'off';  
    protected $table = 'status_registri_lezioni';
}