<?php

namespace App\Models\Titulus;

use Spatie\ArrayToXml\ArrayToXml;

class ModelBase  {

    protected $attributes = [];
    public $rootElementName;
    public $rootElementAttributes;    
    public $rootElementArray = [];

    public function toArray() 
    { 
        $attr=[];
        foreach($this->attributes as $key => $value) {
            if (!in_array($key, ['attributes','rootElementName','rootElementAttributes'])) {
                if (is_scalar($value))
                    $attr[$key] = $value;
                else if (is_array($value)) {
                    $attr[$key] = [];
                    foreach($value as $item){
                        if (count($attr[$key])==0){
                            if (isset($item->rootElementName)){
                                $attr[$key][$item->rootElementName] = [];
                            } else {
                                $attr[$key] = [];
                            }
                        }
                        if (isset($item->rootElementName)){
                            array_push($attr[$key][$item->rootElementName], $item->toArray());  
                        } else {
                            //condizione per il caso documenti allegato
                            array_push($attr[$key], $item);  
                        }
                    }
                } else{
                    $attr[$key] = $value->toArray();
                }
            }
        }
        foreach($this->rootElementArray as $key => $value) {

        }
        if ($this->rootElementAttributes){
            $attr['_attributes']=array_filter((array)$this->rootElementAttributes);
        }
        return $attr;
    } 

    /**
     * Set a given attribute on the model.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return mixed
     */
    public function setAttribute($key, $value)
    {
        $this->attributes[$key] = $value;
        return $this;
    }

    public function getAttribute($key)
    {
        if (! $key) {
            return;
        }

        if (isset($this->attributes[$key])) {
            return $this->attributes[$key];
        }
    }

    

    /**
     * Dynamically retrieve attributes on the model.
     *
     * @param  string  $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->getAttribute($key);
    }

    /**
     * Dynamically set attributes on the model.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return void
     */
    public function __set($key, $value)
    {
        $this->setAttribute($key, $value);
    }

    public function toXml(){        
        $result = ArrayToXml::convert($this->toArray(),[
            'rootElementName' => $this->rootElementName,
            '_attributes' => array_filter((array)$this->rootElementAttributes),
        ], true, 'UTF-8');
        return $result;
    }

}