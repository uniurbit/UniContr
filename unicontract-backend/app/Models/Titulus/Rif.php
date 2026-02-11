<?php

namespace App\Models\Titulus;

use Spatie\ArrayToXml\ArrayToXml;


// <rif_esterno data_prot="20040101" n_prot="1243">
// <nome cod="SE000095" xml:space="preserve">Ditta srl</nome>
// <referente cod="PE000928" nominativo="Mario Rossi"/>
// <indirizzo email="mrossi@ditta.it"
//            fax="051 451242"
//            tel="051 452844"
//            xml:space="preserve">
//    Via Manzoni 2 - 40033 Casalecchio di Reno - BO - Italia
// </indirizzo>
// </rif_esterno>
class Rif extends ModelBase
{
    public $fillable = ['nome','referente','indirizzo'];

    public function __construct($name=NULL)
    {
        if ($name)
            $this->rootElementName = $name;
        else        
            $this->rootElementName = 'rif';

        $this->rootElementAttributes = new RifAttributi;                
    }
    
    public function addIndirizzo($indirizzocompleto, $email=NULL, $pec=null){
        $indirizzo = new Element('indirizzo');          
        $indirizzo->_value = $indirizzocompleto;

        if ($email!=NULL)
            $indirizzo->rootElementAttributes->email = $email;                             

        if ($pec != null)
            $indirizzo->rootElementAttributes->email_certificata = $pec;                             

        $this->attributes['indirizzo'] = $indirizzo;
    }

    public function addReferente($nominativo= NULL, $cod = NULL){
        $referente = new Element('referente');          
        
        if ($nominativo!=NULL)
            $referente ->rootElementAttributes->nominativo = $nominativo;                             
        //$referente->rootElementAttributes->cod = "PE000928";
        if ($cod!=NULL)
            $referente ->rootElementAttributes->cod = $cod;                             

        $this->attributes['referente'] = $referente;
    }
}

//diritto="RPA" nome_persona="Amministratore Amministratore" nome_uff="Area Test"
class RifAttributi
{
    public $diritto;
    public $nome_persona;
    public $nome_uff;
    public $data_prot;
    public $n_prot;
}