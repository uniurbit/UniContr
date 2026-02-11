<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Validator;
use Illuminate\Validation\ValidationException;

abstract class BaseEntity extends Model {

    public static $rules = [];

    public static function rules(){
        return static::$rules;
    }

    public function getId() {

        return $this->id;

    }

    public function getValidator() {

        return Validator::Make($this->getAttributes(), $this->rules());        
    }
    
     /**
     * Used to determine if the object is valid.
     *
     * @return bool
     * true if the object is valid, false otherwise.
     */
    public function isValid() : bool
    {
        return ! $this->isInvalid();
    }

    /**
     * Used to determine if the object is invalid.
     *
     * @return bool
     *         true if the object is invalid, false otherwise.
     */
    public function isInvalid() : bool
    {
        return $this->getValidator()->fails();
    }

    /**
     * Used to validate the model.
     *
     * @throws \Illuminate\Validation\ValidationException
     *         Thrown if the model is not valid.
     *
     * @return void
     */
    public function validate()
    {
        if ($this->isInvalid()) {
            throw new ValidationException($this->getValidator());
        }
    }

}