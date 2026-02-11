<?php

namespace App\Soap\Response;

class SaveDocumentResponse {

    /**
   * @var string
   */
    private $saveDocumentReturn;

  /**
   * saveDocumentReturn constructor.
   *
   * @param string
   */
  public function __construct($saveDocumentReturn)
  {
    $this->saveDocumentReturn = $saveDocumentReturn;
  }

  /**
   * @return string
   */
  public function getSaveDocumentReturn()
  {
    return $this->saveDocumentReturn;
  }
    
  public function setSaveDocumentReturn($saveDocumentReturn)
  {
      return ($this->saveDocumentReturn = $saveDocumentReturn);
  }
}
