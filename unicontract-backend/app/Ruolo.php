<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Http\Controllers\Api\V1\QueryBuilder;
use Illuminate\Support\Str;

class Ruolo extends Model
{
    protected $connection = 'oracle';    

    public $table = 'V_RUOLI';
    public $primaryKey = 'RUOLO';

    const DOCENTITYPE = array(9,1,11);
    const PTATYPE = array(3);

    const DOCRUOLO = array('SD','AS','LS','PA','PO','SC','RU');

    public static function isRuoloDocente($ruolo){
       return in_array($ruolo, self::DOCRUOLO); 
    }
     // Allow for camelCased attribute access
     public function getAttribute($key)
     {
        return parent::getAttribute(Str::snake($key));
     }
 
     public function setAttribute($key, $value)
     {
        return parent::setAttribute(Str::snake($key), $value);
     }     

     public function isDocente()
     {
        return in_array($this->tipoRuolo, self::DOCENTITYPE);
     }
     public function isPta()
     {
        return in_array($this->tipoRuolo, self::PTATYPE);
     }
}

//decodifica dei tipi ruolo
// 12	Ricercatori a tempo determinato
// 6	Borsisti
// 9	Docenti di ruolo di IIa fascia
// 10	Dottorandi
// 11	Altro personale docente
// 1	Docenti di ruolo di Ia fascia
// 2	Ricercatori
// 3	Personale tecnico amm.vo
// 4	Personale esterno ed autonomi
// 8	Altri
// 0	Non assegnato
// 5	Collaboratori
// 7	Assegnisti
// 14	Professori a tempo determinato
// 13	Dirigenti
// 15	Apprendisti
// 18	Supplenti Docenti
// 16	Lettori e Collaboratori Linguistici
// 17	Tirocinanti
