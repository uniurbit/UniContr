<?php

namespace App\Soap\Request;

class WsdtoPersonaFisicaSearch
{

    /**
     * @var string $client
     * @access public
     */
    public $client = null;

    /**
     * @var string $codAnagrafico
     * @access public
     */
    public $codAnagrafico = null;

    /**
     * @var string $codEsse3
     * @access public
     */
    public $codEsse3 = null;

    /**
     * @var string $codEsterno
     * @access public
     */
    public $codEsterno = null;

    /**
     * @var string $codiceFiscale
     * @access public
     */
    public $codiceFiscale = null;

    /**
     * @var string $cognome
     * @access public
     */
    public $cognome = null;

    /**
     * @var dateTime $dataRiferimento
     * @access public
     */
    public $dataRiferimento = null;

    /**
     * @var string $EMail
     * @access public
     */
    public $EMail = null;

    /**
     * @var boolean $erroreUtenzaDoppia
     * @access public
     */
    public $erroreUtenzaDoppia = null;

    /**
     * @var int $idInterno
     * @access public
     */
    public $idInterno = null;

    /**
     * @var string $matricola
     * @access public
     */
    public $matricola = null;

    /**
     * @var string $nome
     * @access public
     */
    public $nome = null;

    /**
     * @var string $userAlias
     * @access public
     */
    public $userAlias = null;

    /**
     * @var string $username
     * @access public
     */
    public $username = null;

    /**
     * @param string $client
     * @param string $codAnagrafico
     * @param string $codEsse3
     * @param string $codEsterno
     * @param string $codiceFiscale
     * @param string $cognome
     * @param dateTime $dataRiferimento
     * @param string $EMail
     * @param boolean $erroreUtenzaDoppia
     * @param int $idInterno
     * @param string $matricola
     * @param string $nome
     * @param string $userAlias
     * @param string $username
     * @access public
     */
    public function __construct($client, $codAnagrafico, $codEsse3, $codEsterno, $codiceFiscale, $cognome, $dataRiferimento, $EMail, $erroreUtenzaDoppia, $idInterno, $matricola, $nome, $userAlias, $username)
    {
      $this->client = $client;
      $this->codAnagrafico = $codAnagrafico;
      $this->codEsse3 = $codEsse3;
      $this->codEsterno = $codEsterno;
      $this->codiceFiscale = $codiceFiscale;
      $this->cognome = $cognome;
      $this->dataRiferimento = $dataRiferimento;
      $this->EMail = $EMail;
      $this->erroreUtenzaDoppia = $erroreUtenzaDoppia;
      $this->idInterno = $idInterno;
      $this->matricola = $matricola;
      $this->nome = $nome;
      $this->userAlias = $userAlias;
      $this->username = $username;
    }

    public static function fromBasicData($nome, $cognome, $matricola, $idInterno = null, $codiceFiscale = null) {
      $new = new static(null, null, null, null, $codiceFiscale, $cognome, null, null, null,  $idInterno, $matricola, $nome, null, null);
      return $new;
    }


}
