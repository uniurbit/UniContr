<?php

namespace App\Soap\Request;

class ElencaCoordPagamento
{

    /**
     * @var wsdtoPersonaFisicaSearch $dtoRicerca
     * @access public
     */
    public $dtoRicerca = null;

    /**
     * @var string $matricola
     * @access public
     */
    public $matricola = null;

    /**
     * @param wsdtoPersonaFisicaSearch $dtoRicerca
     * @param string $matricola
     * @access public
     */
    public function __construct($dtoRicerca, $matricola)
    {
      $this->dtoRicerca = $dtoRicerca;
      $this->matricola = $matricola;
    }

}
