<?php

namespace App\Models\Titulus;

class Element extends ModelBase
{
    public function __construct($name=NULL)
    {
        if ($name)
            $this->rootElementName = $name;
        else        
            $this->rootElementName = '';

        $this->rootElementAttributes = new GenericAttributes;                
    }    
}

class GenericAttributes
{
    public $cod;
    public $nominativo;
    public $email;
    public $email_certificata;
    public $fax;
    public $tel;
    public $addr;
}