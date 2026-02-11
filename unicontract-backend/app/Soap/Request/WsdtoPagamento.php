<?php

namespace App\Soap\Request;

class WsdtoPagamento extends Wsdto
{

    /**
     * @var string $abi
     * @access public
     */
    public $abi = null;

    /**
     * @var string $bic
     * @access public
     */
    public $bic = null;

    /**
     * @var string $cab
     * @access public
     */
    public $cab = null;

    /**
     * @var string $cin
     * @access public
     */
    public $cin = null;

    /**
     * @var string $client
     * @access public
     */
    public $client = null;

    /**
     * @var string $codEsternoCoordPag
     * @access public
     */
    public $codEsternoCoordPag = null;

    /**
     * @var string $codMod
     * @access public
     * Required 
     */
    public $codMod = null;

    /**
     * @var string $codNazione
     * @access public
     * Required 
     */
    public $codNazione = null;

    /**
     * @var dateTime $dataFine
     * @access public
     * Required
     */
    public $dataFine = null;

    /**
     * @var dateTime $dataInizio
     * @access public
     * Required
     */
    public $dataInizio = null;

    /**
     * @var boolean $delega
     * @access public
     */
    public $delega = null;

    /**
     * @var string $desBanca
     * @access public
     */
    public $desBanca = null;

    /**
     * @var string $desFiliale
     * @access public
     */
    public $desFiliale = null;

    /**
     * @var string $desMod
     * @access public
     */
    public $desMod = null;

    /**
     * @var string $descrizione
     * @access public
     */
    public $descrizione = null;

    /**
     * @var string $iban
     * @access public
     */
    public $iban = null;

    /**
     * @var int $idCoordPag
     * @access public
     */
    public $idCoordPag = null;

    /**
     * @var string $intestazioneConto
     * @access public
     */
    public $intestazioneConto = null;

    /**
     * @var string $note
     * @access public
     */
    public $note = null;

    /**
     * @var string $numeroConto
     * @access public
     */
    public $numeroConto = null;

    /**
     * @var int $priorita
     * @access public
     */
    public $priorita = null;

    /**
     * @var boolean $usoCSA
     * @access public
     */
    public $usoCSA = null;

    /**
     * @var boolean $usoRimborso
     * @access public
     */
    public $usoRimborso = null;

    /**
     * @param string $client
     * @param boolean $delega
     * @param boolean $usoCSA
     * @param boolean $usoRimborso
     * @access public
     */
    public function __construct($client, $delega, $usoCSA, $usoRimborso)
    {
      $this->client = $client;
      $this->delega = $delega;
      $this->usoCSA = $usoCSA;
      $this->usoRimborso = $usoRimborso;
    }


    /**
     * @param string $intestazioneConto
     * @param string $codMod 'CC'
     * @param string $codNazione
     * @param dateTime $dataInizio 2018-05-01T00:00:00+02:00
     * @param dateTime $dataFine
     * @param string $iban
     */
    public static function fromBasicData($abi, $cab, $cin, $intestazioneConto, $numeroConto, $codMod, $codNazione, $dataInizio, $dataFine, $iban) {
      $new = new static(null,false,false,false);
      $new->abi=$abi;
      $new->cab=$cab;
      $new->cin=$cin;
      $new->intestazioneConto = $intestazioneConto;
      $new->numeroConto=$numeroConto;
      $new->iban = $iban;
      $new->codMod = $codMod; //'CC';
      $new->codNazione = $codNazione;
      $new->dataInizio = $dataInizio;
      $new->dataFine = $dataFine;
      return $new;
    }

}
