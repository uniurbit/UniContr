<?php

namespace App\Models;

use Jenssegers\Model\Model;

class StrutturaInterna extends Model {
   
    public $elementName = 'struttura_interna';
    
    protected $fillable = [
        'physdoc',
        'nrecord',              
        'cod_padre',
        'cod_amm',
        'cod_aoo',
        'cod_uff',
        'cod_responsabile',
        'nome',
    ];
    
    protected $hidden = ['nrecord','physdoc'];

    protected $queryparam = [
        'struint_coduff',	
        'struint_nome',				
        'struint_codresponsabile',				
        'struint_tipologia',					
        'struint_indirizzocomune',				
        'struint_indirizzoprov',				
        'struint_competenze',					
        'struint_codammaoo',				
        'struint_operatore',				
        'struint_uffoperatore',			      
    ];

    public $querykey = '([UD,/xw/@UdType/]=struttura_interna)';
}