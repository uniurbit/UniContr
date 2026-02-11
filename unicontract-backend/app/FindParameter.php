<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon; 
use App\Observers\UserActionsObserver;

class FindParameter extends Model
{

    protected $_rules = [];

    /** 
    * limit = numero di record per pagina 
    * page = pagina richiesta    
    */
    protected $fillable = [
        'rules',   
        'order_by',
        // 'group_by',
        'limit',
        'page',
        'columns',
        'includes',
        // 'appends'     
        'sessionId'
    ];

    public function setRulesAttribute($values)
    {        
        foreach ($values as $value) {
            $fo = new FindOption($value);
            $this->_rules = array_merge($this->_rules, [ $fo]);
        }
        
    }

    public function getRulesAttribute(){
        return $this->_rules;
    }
    
    public function hasQueryParameter($parameter){
        return isset($this[$parameter]);
    }
}


class FindOption extends Model 
{

    protected $fillable = [
        'field',  
        'operator',
        'value',  
        'type'    
    ];

}