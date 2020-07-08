<?php 

namespace App\Service;

class TitulusExtraDoc
{
    
    public static function addRegistro($node, array $dati){
        $dati = (object)$dati;
        $registro = $node->addChild('registro');
        $registro->addAttribute('tipo', $dati->tipo);   
        $registro->addchild('anno_accademico',$dati->anno_accademico);
        $registro->addchild('periodo_didattico',$dati->periodo_didattico);
        $vigenza_contrattuale = $registro->addchild('vigenza_contrattuale');        
            $vigenza_contrattuale->addChild('dal',$dati->vigenza_contrattuale_dal);
            $vigenza_contrattuale->addChild('al',$dati->vigenza_contrattuale_al);        

        return $registro;
    }

    public static function addIstituzione($node, array $dati){
        $dati = (object)$dati;
        $istituzione = $node->addChild('istituzione');
        $istituzione->addAttribute('cod', $dati->cod);   

            $istituzione->addChild('denominazione',$dati->denominazione);        
            $dipartimento = $istituzione->addChild('dipartimento',$dati->dipartimento);
            $dipartimento->addAttribute('cod',$dati->dipartimento_cod);

        return $istituzione;
    }

    public static function addDati_conservazione($node, array $dati){
        $dati = (object)$dati;
        $dati_conservazione = $node->addChild('dati_conservazione');
        $dati_conservazione->addAttribute('tipologia', $dati->tipologia);
        $dati_conservazione->addAttribute('versione', $dati->versione);
        return $dati_conservazione;
    }

    public static function addSistemaMittente($node, array $dati){
        $dati = (object)$dati;
        $sistema_mittente = $node->addChild('sistema_mittente');
        $sistema_mittente->addChild('id_documento', $dati->id_documento);
        //<!--ID nel sistema Unicontract-->
        $sistema_mittente->addChild('pers_id',$dati->pers_id);
        $sistema_mittente->addChild('codice_dipartimento_registro',$dati->codice_dipartimento_registro);
        $sistema_mittente->addChild('applicativo',$dati->applicativo);
        $sistema_mittente->addChild('versione',$dati->versione);
        return $sistema_mittente;
    }

    public static function addEvento($node,  array $dati){        
        $dati = (object)$dati;
        $evento = $node->addChild('evento');
        $evento->addChild('denominazione',$dati->denominazione);
        $evento->addChild('data',$dati->data);
        $agente = $evento->addChild('agente');
            $agente->addAttribute('tipo', $dati->agente_tipo);
            $agente->addChild('denominazione',$dati->agente_denominazione);
            $agente->addChild('matricola', $dati->agente_matricola);
        return $evento;
    }

    public static function addPersona($node, array $dati){
        $dati = (object)$dati;
        $persona = $node->addChild('persona');
        $persona->addChild('codice_fiscale',$dati->codice_fiscale);
        //<!--ID nel sistema Unicontract-->
        $persona->addChild('cognome',$dati->cognome);
        $persona->addChild('nome',$dati->nome);
        $persona->addChild('data_nascita',$dati->data_nascita);
        $luogo_nascita = $persona->addChild('luogo_nascita',$dati->luogo_nascita);
        $luogo_nascita->addAttribute('cod_istat','028060');

        $persona->addChild('sesso',$dati->sesso);

        $nazione_nascita = $persona->addChild('nazione_nascita',$dati->nazione_nascita);        
        $nazione_nascita->addAttribute('cod_ANS',$dati->cod_ANS);

        $recapito = $persona->addChild('recapito');
        $recapito->addChild('email',$dati->email);
        return $persona;
    }

    public static function  xml_append(\SimpleXMLElement $to, \SimpleXMLElement $from) {
        $toDom = dom_import_simplexml($to);
        $fromDom = dom_import_simplexml($from);
        $toDom->appendChild($toDom->ownerDocument->importNode($fromDom, true));
    }

}