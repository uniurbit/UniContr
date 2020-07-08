<?php

namespace App\Models\Titulus;


class Fascicolo extends ModelBase
{

    public $fillable = ['oggetto','classif','voce_indice','rif_interni','storia'];


    public function __construct()
    {
        $this->rootElementName = 'fascicolo';
        $this->rootElementAttributes = new FascicoloAttributi;
    }

    public function addClassifCod($titolario){
        $classif = new Element('classif');
        $classif->rootElementAttributes->cod = $titolario;        
        $this->attributes['classif'] = $classif;
    }

    public function addRPA($nome_uff, $nome_persona){
        $rif_interno = new Rif('rif');   
        $rif_interno->rootElementAttributes->diritto = "RPA";       
        $rif_interno->rootElementAttributes->nome_uff= $nome_uff;               
        if ($nome_persona)        
            $rif_interno->rootElementAttributes->nome_persona= $nome_persona;                        

        if (isset($this->attributes['rif_interni']) && is_array($this->attributes['rif_interni'])){
            $this->attributes['rif_interni'] = array_merge($this->attributes['rif_interni'],array($rif_interno));
        }else{
            $this->attributes['rif_interni'] = array($rif_interno);
        }
        
    }

    public function addDoc($nrecord){
        $doc = new Element('doc');
        $doc->rootElementAttributes->nrecord = $nrecord;
        $this->attributes['doc'] = $doc;
    }


}



