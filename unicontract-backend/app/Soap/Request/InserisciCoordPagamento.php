<?php

namespace App\Soap\Request;

class InserisciCoordPagamento
{

    /**
     * @var int $idInternoPersona
     * @access public
     */
    public $idInternoPersona = null;

    /**
     * @var string $codAnagraficoPersona
     * @access public
     */
    public $codAnagraficoPersona = null;

    /**
     * @var string $codEsterno
     * @access public
     */
    public $codEsterno = null;

    /**
     * @var string $matricola
     * @access public
     */
    public $matricola = null;

    /**
     * @var string $codEsse3
     * @access public
     */
    public $codEsse3 = null;

    /**
     * @var string $codiceFiscale
     * @access public
     */
    public $codiceFiscale = null;

    /**
     * @var string $EMail
     * @access public
     */
    public $EMail = null;

    /**
     * @var string $username
     * @access public
     */
    public $username = null;

    /**
     * @var string $userAlias
     * @access public
     */
    public $userAlias = null;

    /**
     * @var WsdtoPagamento $coordPagamento
     * @access public
     */
    public $coordPagamento = null;

    /**
     * @var boolean $prioritaMassima
     * @access public
     */
    public $prioritaMassima = null;

    /**
     * @var string $functionType
     * @access public
     */
    public $functionType = null;

    /**
     * @param int $idInternoPersona
     * @param string $codAnagraficoPersona
     * @param string $codEsterno
     * @param string $matricola
     * @param string $codEsse3
     * @param string $codiceFiscale
     * @param string $EMail
     * @param string $username
     * @param string $userAlias
     * @param WsdtoPagamento $coordPagamento
     * @param boolean $prioritaMassima
     * @param string $functionType
     * @access public
     * 
     * https://wiki.u-gov.it/confluence/pages/releaseview.action?pageId=79822895#WSACPersonaFisica(SOAP)-inserisciCoordPagamento
     */
    public function __construct($idInternoPersona, $codAnagraficoPersona, $codEsterno, $matricola, $codEsse3, $codiceFiscale, $EMail, $username, $userAlias, $coordPagamento, $prioritaMassima, $functionType)
    {
      $this->idInternoPersona = $idInternoPersona;
      $this->codAnagraficoPersona = $codAnagraficoPersona;
      $this->codEsterno = $codEsterno;
      $this->matricola = $matricola;
      $this->codEsse3 = $codEsse3;
      $this->codiceFiscale = $codiceFiscale;
      $this->EMail = $EMail;
      $this->username = $username;
      $this->userAlias = $userAlias;
      $this->coordPagamento = $coordPagamento;
      $this->prioritaMassima = $prioritaMassima;
      $this->functionType = $functionType;
    }

    /**
     * @param int $idInternoPersona
     * @param string $matricola
     * @param WsdtoPagamento $coordPagamento
     */
    public static function fromBasicData($idInternoPersona, $matricola, $codiceFiscale, $coordPagamento) {
      $new = new static($idInternoPersona, null, null, $matricola, null, $codiceFiscale, null, null, null, $coordPagamento, null, null);
      return $new;
    }

}
