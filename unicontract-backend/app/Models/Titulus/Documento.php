<?php

namespace App\Models\Titulus;

use Spatie\ArrayToXml\ArrayToXml;


// /doc/oggetto	oggetto
// /doc/classif	classificazione
// /doc/voce_indice	voce di indice
// /doc/allegato	campo “Allegato” (ripetibile)
// /doc/repertorio	contiene la descrizione del repertorio (solo nei repertori)
// /doc/repertorio/@cod	contiene il codice del repertorio (solo nei repertori)
// /doc/rif_esterni/rif	mittente o destinatario (ripetibile)
// /doc/rif_interni/rif	riferimenti interni (RPA, CC…)
// /doc/files	contiene i file allegati (non le immagini)
// /doc/immagini	contiene le immagini allegate
// /doc/minuta	contiene le informazioni sulla minuta (solo documenti tra uffici)
// /doc/storia	contiene la storia degli interventi sul documento

//In questo paragrafo per “documento” si intende un documento in arrivo, in partenza, tra uffici o non protocollato.
class Documento extends ModelBase
{
     
    // /doc/@tipo	tipo (“arrivo” o “partenza” o “interno” o “varie”)
     const ARRIVO = 'arrivo';
     const PARTENZA = 'partenza';
     const INTERNO = 'interno';
     const VARIE = 'varie';


    public $fillable = ['oggetto','classif','voce_indice','allegato','repertorio','rif_esterni','rif_interni','files','immagini','minuta','storia'];

    public function __construct()
    {
        $this->rootElementName = 'doc';
        $this->rootElementAttributes = new DocumentoAttributi;
    }

    public function addRifInt($nome_uff, $nome_persona, $diritto, $cod_uff=NULL){
        $rif_interno = new Rif('rif_interno');   
        $rif_interno->rootElementAttributes->diritto =  $diritto;       
        $rif_interno->rootElementAttributes->nome_uff= $nome_uff;                             
        $rif_interno->rootElementAttributes->nome_persona= $nome_persona;                        
        if ($cod_uff!=null)
            $rif_interno->rootElementAttributes->cod_uff= $cod_uff;       

        if (isset($this->attributes['rif_interni']) && is_array($this->attributes['rif_interni'])){
            $this->attributes['rif_interni'] = array_merge($this->attributes['rif_interni'],array($rif_interno));
        }else{
            $this->attributes['rif_interni'] = array($rif_interno);
        }        
    }

    public function addRPA($nome_uff, $nome_persona=NULL, $cod_uff=NULL){
        $this->addRifInt($nome_uff, $nome_persona, 'RPA');              
    }

    public function addCDS($nome_uff, $nome_persona, $cod_uff=NULL){
        $this->addRifInt($nome_uff, $nome_persona, 'CDS');
    }

    public function addOP($nome_uff, $nome_persona, $cod_uff=NULL){
        $this->addRifInt($nome_uff, $nome_persona, 'OP');
    }

    public function addCC($nome_uff, $nome_persona, $cod_uff=NULL){
        $this->addRifInt($nome_uff, $nome_persona, 'CC');
    }

    public function addClassifCod($titolario){
        $classif = new Element('classif');
        $classif->rootElementAttributes->cod = $titolario;        
        $this->attributes['classif'] = $classif;
    }

    public function addRepertorio($codice, $nomerepertorio){
        $rep = new Element('repertorio');
        $rep->rootElementAttributes->cod = $codice;        
        $rep->_value =  $nomerepertorio;
        $this->attributes['repertorio'] = $rep;
    }


    public function addAllegato($descr){
        if (!isset($this->attributes['allegato'])) 
            $this->attributes['allegato'] = [];

        if (!is_array($this->attributes['allegato']))
            $this->attributes['allegato'] = [];

        array_push($this->attributes['allegato'],['_value' => $descr]);
    }

    public function addVoceIndice($descr){
        $voce = new Element('voce_indice');
        $voce->_value =  $descr;
        $this->attributes['voce_indice'] = $voce;
    }
}

