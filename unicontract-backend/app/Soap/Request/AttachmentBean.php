<?php

namespace App\Soap\Request;

class AttachmentBean {
        
     /**
     * The content
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var base64Binary
     */
    public $content;
    /**
     * The contentProviderId
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $contentProviderId;
    /**
     * The contentProviderParams
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var anyType
     */
    public $contentProviderParams;
    /**
     * The contentUri
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $contentUri;
    /**
     * The description
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $description;
    /**
     * The fileName
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $fileName;
    /**
     * The id
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $id;
    /**
     * The mimeType
     * Meta informations extracted from the WSDL
     * - nillable : true
     * @var string
     */
    public $mimeType;
    /**
     * Constructor method for AttachmentBean     
     * @param base64Binary $_content
     * @param string $_contentProviderId
     * @param anyType $_contentProviderParams
     * @param string $_contentUri
     * @param string $_description
     * @param string $_fileName
     * @param string $_id
     * @param string $_mimeType
     * @return AttachmentBean
     */
    public function __construct($_content = NULL,$_contentProviderId = NULL,$_contentProviderParams = NULL,$_contentUri = NULL,$_description = NULL,$_fileName = NULL,$_id = NULL,$_mimeType = NULL)
    {
        $_arrayOfValues = array('content'=>$_content,'contentProviderId'=>$_contentProviderId,'contentProviderParams'=>$_contentProviderParams,'contentUri'=>$_contentUri,'description'=>$_description,'fileName'=>$_fileName,'id'=>$_id,'mimeType'=>$_mimeType);

        $this->init($_arrayOfValues);
       
    }

    public function init($_arrayOfValues)
    {
        /**
         * Generic set methods
         */
        if(is_array($_arrayOfValues) && count($_arrayOfValues))
        {
            foreach($_arrayOfValues as $name=>$value)
                $this->_set($name,$value);
        }

    }

    /**
     * Get content value
     * @return base64Binary|null
     */
    public function getContent()
    {
        return $this->content;
    }
    /**
     * Set content value
     * @param base64Binary $_content the content
     * @return base64Binary
     */
    public function setContent($_content)
    {
        return ($this->content = $_content);
    }
    /**
     * Get contentProviderId value
     * @return string|null
     */
    public function getContentProviderId()
    {
        return $this->contentProviderId;
    }
    /**
     * Set contentProviderId value
     * @param string $_contentProviderId the contentProviderId
     * @return string
     */
    public function setContentProviderId($_contentProviderId)
    {
        return ($this->contentProviderId = $_contentProviderId);
    }
    /**
     * Get contentProviderParams value
     * @return anyType|null
     */
    public function getContentProviderParams()
    {
        return $this->contentProviderParams;
    }
    /**
     * Set contentProviderParams value
     * @param anyType $_contentProviderParams the contentProviderParams
     * @return anyType
     */
    public function setContentProviderParams($_contentProviderParams)
    {
        return ($this->contentProviderParams = $_contentProviderParams);
    }
    /**
     * Get contentUri value
     * @return string|null
     */
    public function getContentUri()
    {
        return $this->contentUri;
    }
    /**
     * Set contentUri value
     * @param string $_contentUri the contentUri
     * @return string
     */
    public function setContentUri($_contentUri)
    {
        return ($this->contentUri = $_contentUri);
    }
    /**
     * Get description value
     * @return string|null
     */
    public function getDescription()
    {
        return $this->description;
    }
    /**
     * Set description value
     * @param string $_description the description
     * @return string
     */
    public function setDescription($_description)
    {
        return ($this->description = $_description);
    }
    /**
     * Get fileName value
     * @return string|null
     */
    public function getFileName()
    {
        return $this->fileName;
    }
    /**
     * Set fileName value
     * @param string $_fileName the fileName
     * @return string
     */
    public function setFileName($_fileName)
    {
        return ($this->fileName = $_fileName);
    }
    /**
     * Get id value
     * @return string|null
     */
    public function getId()
    {
        return $this->id;
    }
    /**
     * Set id value
     * @param string $_id the id
     * @return string
     */
    public function setId($_id)
    {
        return ($this->id = $_id);
    }
    /**
     * Get mimeType value
     * @return string|null
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }
    /**
     * Set mimeType value
     * @param string $_mimeType the mimeType
     * @return string
     */
    public function setMimeType($_mimeType)
    {
        return ($this->mimeType = $_mimeType);
    }
   
     /**
     * Generic method setting value
     * @param string $_name property name to set
     * @param mixed $_value property value to use
     * @return bool
     */
    public function _set($_name,$_value)
    {
        $setMethod = 'set' . ucfirst($_name);
        if(method_exists($this,$setMethod))
        {
            $this->$setMethod($_value);
            return true;
        }
        else
            return false;
    }
}