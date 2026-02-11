<?php

namespace App\Soap\Request;

class SaveParams {

  /**
     * The pdfConversion
     * @var boolean
     */
    public $pdfConversion;
    /**
     * The sendEMail inivio email all'assegnatari del documento
     * gli assegnatari sono quelli assegnati alla voce_indice associata al documento
     * @var boolean
     */
    public $sendEMail;
    /**
     * Constructor method for SaveParams
     * @param boolean $_pdfConversion
     * @param boolean $_sendEMail
     * @return SaveParams
     */
    public function __construct($_pdfConversion = NULL,$_sendEMail = NULL)
    {
         $this->pdfConversion = $_pdfConversion;
         $this->sendEMail = $_sendEMail;
    }


    /**
     * Get pdfConversion value
     * @return boolean|null
     */
    public function getPdfConversion()
    {
        return $this->pdfConversion;
    }
    /**
     * Set pdfConversion value
     * @param boolean $_pdfConversion the pdfConversion
     * @return boolean
     */
    public function setPdfConversion($_pdfConversion)
    {
        return ($this->pdfConversion = $_pdfConversion);
    }
    /**
     * Get sendEMail value
     * @return boolean|null
     */
    public function getSendEMail()
    {
        return $this->sendEMail;
    }
    /**
     * Set sendEMail value
     * @param boolean $_sendEMail the sendEMail
     * @return boolean
     */
    public function setSendEMail($_sendEMail)
    {
        return ($this->sendEMail = $_sendEMail);
    }


}