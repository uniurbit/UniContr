<?php

namespace App\Models;

use Jenssegers\Model\Model;

class StrutturaEsterna extends Model {
   
    public $elementName = 'struttura_esterna';

    protected $fillable = [
        'physdoc',
        'nrecord',         
        'cod_uff',     
        'codice_fiscale',
        'partita_iva',
        'tipologia',
        'nome',
        'indirizzo',
        'email_certificata_addr',
        'telefoni',
        'emails',
        'siti_web',       
        'email_certificata',
    ];
    
    protected $hidden = ['nrecord','physdoc'];

    protected $queryparam = [
        'struest_coduff',	
        'struest_codsap',				
        'struest_codfisc',				
        'struest_piva',					
        'struest_nome',				
        'struest_tipologia',				
        'struest_indirizzocomune',					
        'struest_indirizzoprov',				
        'struest_competenze',				
        'struest_emailaddr',		
        'struest_codresponsabile',			     
        'struestcreazione',
        'struest_categoria',
        'struest_operatore',
        'struest_uffoperatore',
        'struest_telnum'
    ];

    public $querykey = '([UD,/xw/@UdType/]=struttura_esterna)';


    public function setIndirizzoAttribute($value)    
    {
        if ( is_object($value) || is_array($value) ){
            return $this->attributes['indirizzo'] = $value;
        }
        return  $this->attributes['indirizzo'] = array('value' => $value);
    }
}