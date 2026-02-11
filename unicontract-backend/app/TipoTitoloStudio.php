<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoTitoloStudio extends Model
{
   
    protected $connection = 'oracle';    

    public $table = 'TIPI_TITOLO_STUDIO';
    public $primaryKey = 'TIPO_TITOLO';


}
