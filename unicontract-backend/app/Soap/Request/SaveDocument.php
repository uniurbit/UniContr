<?php

namespace App\Soap\Request;

class SaveDocument
{
  /**
   * @var string
   */
  protected $document;


  /**
   * @var AttachmentBean[]
   */
  protected $attachmentBeans;


  /**
   * @var SaveParams
   */
  protected $saveParams;
  
      
  /**
   * SaveDocument constructor.
   *
   * @param string $document
   */
  public function __construct($document, $attachmentBeans, $saveParams)
  {
    $this->document = $document;
    $this->attachmentBeans = $attachmentBeans;
    $this->saveParams = $saveParams;
  }

  /**
   * @return string
   */
  public function getDocument()
  {
    return $this->document;
  }

  public function setDocument($_document)
  {
      return ($this->document = $_document);
  }

  /**
   * @return  AttachmentBean[]
   */
  public function getAttachmentBeans() {
    return $this->attachmentBeans;
  }

  public function setAttachmentBeans($_attachmentBeans)
  {
      return ($this->attachmentBeans = $_attachmentBeans);
  }

  /**
   * @return  SaveParams
   */
  public function getSaveParams() {
    return $this->saveParams;
  }

  public function setSaveParams($_saveParams)
  {
      return ($this->saveParams = $_saveParams);
  }    

}