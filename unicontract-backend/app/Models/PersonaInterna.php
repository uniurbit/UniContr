<?php

namespace App\Models;

use Jenssegers\Model\Model;

class PersonaInterna extends Model {

    public $elementName = 'persona_interna';
    //physdoc="630324" nrecord="000630324-UNURTST-a6c170b2-7e32-4196-9c76-a0baaf1952fd" matricola="PI000203" nome="Riccardo" cognome="Righi" cod_amm="UNUR" cod_aoo="TST" cod_uff="SI000103">
    protected $fillable = [
        'physdoc',
        'nrecord',
        'matricola',
        'nome',
        'cognome',
        'cod_amm',
        'cod_aoo',
        'cod_uff',
        'login'
    ];
    
    protected $hidden = ['nrecord','physdoc'];

    protected $queryparam = [
        'persint_gruppoappartenenzacod',	
        'persint_coduff',				
        'persint_matricola',				
        'persint_tipo',					
        'persint_nomcogn',				
        'persint_codammaoo',				
        'persint_nome',					
        'persint_loginname',				
        'persint_cognome',				
        'persint_soprannome',			
        'persint_qualifica',				
        'persint_mansione',				
        'persint_mansionecod',			
        'persint_competenze',			
        'persint_diritti',				
        'persint_diritticod',			
        'persint_recapitoemailaddr',		
        'persint_operatore',				
        'persint_uffoperatore',			
        'persint_profilecod',			
        'persint_profilename',	
    ];

    public $querykey = '([UD,/xw/@UdType/]=persona_interna)';

    protected $appends = ['descrizione'];

    public function getDescrizioneAttribute()
    {
        if (array_key_exists( 'nome', $this->attributes) && array_key_exists('cognome', $this->attributes))
            return ucfirst($this->attributes['nome']).' '.ucfirst($this->attributes['cognome']);

        if (array_key_exists('nome', $this->attributes))
            return ucfirst($this->attributes['nome']);
        
        if (array_key_exists('cognome', $this->attributes))
            return ucfirst($this->attributes['cognome']);
    }

    public function getNomepersonaAttribute(){
        return strtolower($this->attributes['cognome']).' '.strtolower($this->attributes['nome']);
    }

    public function getLoginNameAttribute(){
        return $this->login['name']; 
    }
}