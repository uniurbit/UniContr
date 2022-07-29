<?php

namespace App\Soap\Request;

class ElencaPersone
{

    /**
     * @var wsdtoPersonaFisicaSearch $dtoRicerca
     * @access public
     */
    public $dtoRicerca = null;

    /**
     * @param wsdtoPersonaFisicaSearch $dtoRicerca
     * @access public
     */
    public function __construct($dtoRicerca)
    {
      $this->dtoRicerca = $dtoRicerca;
    }

}
