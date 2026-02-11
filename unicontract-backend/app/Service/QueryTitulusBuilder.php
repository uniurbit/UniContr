<?php

namespace App\Service;
use Exceptions;
use App\Http\Controllers\iSearch;
use Jenssegers\Model\Model;
use Illuminate\Http\Request;
use App\Exceptions\UnknownColumnException;
use App\FindParameter;
use Illuminate\Support\Collection;
use Illuminate\Pagination\Paginator as BasePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Str;

class QueryTitulusBuilder {

    protected $query;
    protected $soapController;
    protected $sessionId;
    protected $request;

    protected $model;
    protected $findParameter;

    protected $wheres = [];
    protected $orderBy = [];
    protected $limit;
    protected $page = 1;
    protected $offset = 0;
    protected $columns = ['*'];
    
    protected $constantParameters = [        
        'limit',
        'page',      
        'orderBy',  
        'sessionId',
    ];    

    public function __construct() 
    { 
        $a = func_get_args(); 
        $i = func_num_args(); 
        if (method_exists($this,$f='__construct'.$i)) { 
            call_user_func_array(array($this,$f),$a); 
        } 
    } 


    public function __construct3(Model $model, Request $request, iSearch $soapController)
    {
        $this->soapController = $soapController;
        $this->request = $request;
        $this->orderBy = '';
        $this->limit = config('querybuilder.limit');        
        $this->model = $model;
        
        $this->findParameter = new \App\FindParameter($request->all());      

        $this->query = '';
    }

    public function __construct4(Model $model, ?Request $request, iSearch $soapController, FindParameter $findParameter)
    {        
        $this->soapController = $soapController;
        $this->request = $request;
        $this->orderBy = '';
        $this->limit = config('querybuilder.limit');        
        $this->model = $model;
        
        $this->findParameter = $findParameter;      

        $this->query = '';
    }

    protected function prepare()
    {
        $this->setWheres($this->findParameter);

        $constantParameters = $this->constantParameters;
        array_map([$this, 'prepareConstant'], $constantParameters); 
        return $this;
    }

    public function setSessionId($sessionId)
    {        
        $this->sessionId = $sessionId;
    }
    private function setOrderBy($order)
    {        
        $this->orderBy = $order;
    }
        
    private function setLimit($limit)
    {
        $limit = ($limit == 'unlimited') ? null : (int)$limit;
        $this->limit = $limit;
    }
    private function setWheres($parameters)
    {
        $this->wheres = $parameters->rules;
    }
    private function hasWheres()
    {
        return (count($this->wheres) > 0);
    }
    private function hasLimit()
    {
        return ($this->limit);
    }
    public function build()
    {
        $this->prepare();

        if ($this->hasWheres()) {
            array_map([$this, 'addWhereToQuery'], $this->wheres);
        }
               
        return $this;
    }

    private function prepareConstant($parameter)
    {        
        // 'limit',
        // 'page',
        if (!$this->findParameter->hasQueryParameter($parameter)) {
            return;
        }
        $callback = [$this, $this->setterMethodName($parameter)];
        $callbackParameter = $this->findParameter[$parameter];        
        call_user_func($callback, $callbackParameter);
    }

    private function setterMethodName($key)
    {
        return 'set' . Str::studly($key);
    }
    private function customFilterName($key)
    {
        return 'filterBy' . Str::studly($key);
    }
    private function setPage($page)
    {
        $this->page = (int)$page;
        $this->offset = ($page - 1) * $this->limit;
    }
    private function addWhereToQuery($where)
    {        

        //([NOT] [<canale di ricerca>]=<termini>) [<operatore> ([<canale di ricerca>]=termini) ...]        
        if (isset($where->values)) {
            $value = $values;
        }
        if (!isset($where->operator)) {
            $operator = '';
        }

        if (!empty($this->query)){
            $this->query .= ' AND ';
        }

        /** @var string $type */
        if ($where->operator == 'In') {
            $this->query .= '(['.$where->field.']='.$where->value.')';

        } else if ( $where->operator == 'NotIn') {
            $this->query .= '([NOT]['.$where->field.']='.$where->value.')';
        }
        else if ( $where->operator == 'contains') {  
            //Attenzione in titulus * iniziale per gli indici viene escluso diventa una ricerca inizia per       
            $this->query .= '(['.$where->field.']=*'.$where->value.'*)';
        } else {
            if ( $where->value == '[null]') {
                if ( $where->operator == '=') {
                    $this->query .= '(['.$where->field.']='.$where->value.')';
                } else {
                    $this->query .= '([NOT]['.$where->field.']='.$where->value.')';
                }
            } else {
                $this->query .= '(['.$where->field.']'.$where->operator.''.$where->value.')';
            }
        }
    }

    public function get()
    {
        //('([/doc/@tipo]=arrivo)',null,null,2);search();
        if (empty($this->query))
            $this->query = $this->model->querykey;

        $result = null; 
        if ($this->sessionId && $this->page){
            //richiesta di una pagina specifica del resultset corrente
            $result = $this->soapController->titlePage($this->sessionId,$this->page);
        }else{            
            //caso di una prima ricerca dove è stata impostata una sessione utente
            //se esiste una sessione utente viene utilizzata
            $sessionLoginId = $this->soapController->getSessionId();
            $result = $this->soapController->search($this->query,$this->orderBy,null,$this->limit, $sessionLoginId);
            $this->sessionId = implode(';', $this->soapController->getSessionId());    
        }
        
        return $this->resultToModel($result);
    }

    protected function resultToModel($result)
    {
        $objResult = simplexml_load_string($result);
        //<Response pageCount="39" pageIndex="1" seleId="5c867305e01f62515e8b46f8" seleSize="77" canNext="true" canLast="true">
        $this->pageCount = (string)$objResult->attributes()->pageCount;
        $this->pageIndex = (string)$objResult->attributes()->pageIndex;
        $this->seleSize = (string)$objResult->attributes()->seleSize;
        
        $this->canNext = (bool)$objResult->attributes()->canNext;
        $this->canLast = (bool)$objResult->attributes()->canLast;

        $resultCollection = new Collection([]);
        foreach ($objResult->children() as $key => $element){       
            //restituisco solo i modelli previsti dalla ricerca    
            if ($this->model->elementName == $key){
                $model = $this->model->replicate();
                    
                $arr= QueryTitulusBuilder::xmlToArray($element, []);           
                $model->fill($arr);

                $resultCollection->push($model);
            }
        }
        return $resultCollection;
    }

    public function getSessionId()
    {
        return $this->sessionId;
    }

    public function paginate()
    {
        if (!$this->hasLimit()) {
            throw new Exception("You can't use unlimited option for pagination", 1);
        }
        $result = $this->basePaginate($this->limit);     
            
        $array = $result->toArray();
        if ($this->sessionId)
            $array['sessionId'] = $this->sessionId;

        return $array;
    }

    private function basePaginate($perPage = null, $columns = ['*'], $pageName = 'page', $page = null)
    {
        $page = $page ?: BasePaginator::resolveCurrentPage($pageName);
        $perPage = $perPage ?: $this->model->getPerPage();

        $results = $this->get();

        $total = (int)$this->seleSize;

        return (new Paginator($results, $total, $perPage, $page, [
            'path' => BasePaginator::resolveCurrentPath(),
            'pageName' => $pageName,   
            'sessionId' => $this->sessionId,
        ])); 
    }


    public static function attributesToArray($element, $out = array()){
        foreach($element->attributes() as $key=>$val){
            $out[$key] = (string)$val;
        }
        return $out;
    }

    public static function xmlToArray(\SimpleXMLElement $element, array $result){
        foreach($element->attributes() as $key=>$val){
            $result[(string)$key] = (string)$val;
        }

        //TODO valutare children multipli
        foreach ($element->children() as $child => $value) { 

            $childname = ($child instanceof \SimpleXMLElement) ? $child->getName() : $child; 
            if ($value && (string)$value !== '' && !$value->attributes())
                $result[(string)$childname] = (string)$value;
            
            if ($value instanceof \SimpleXMLElement){       
                if ($value->attributes()){         
                    $app = QueryTitulusBuilder::attributesToArray($value);                       
                    if ($value && (string)$value !== '')
                        $app['value'] = (string)$value;

                    if ($app){
                        //se $childname esiste allora devo fare il push          
                        if (array_key_exists($childname, $result)){
                            if (is_array($result[$childname]) && array_key_exists('0',$result[$childname]))
                                array_push($result[$childname], $app);
                            else {
                                $previus = $result[$childname];                                
                                $result[$childname] = [];
                                array_push($result[$childname], $previus);
                                array_push($result[$childname], $app);
                            }
                        }else{
                            $result[$childname] = $app;
                        }                                       
                        $app = null;
                    }

                }       
            }
        
            if ($child instanceof \SimpleXMLElement){
                xmlToArray($child, $result);
            }            
        }

        return $result;        
    }

   
    

    public static function simpleXmlObjectToArray($xmlObject, $out = array())
    {
        foreach ((array) $xmlObject as $index => $node){
            if ( is_object($node) || is_array($node) ){
                if ($index==='@attributes'){
                    $res = QueryTitulusBuilder::simpleXmlObjectToArray($node);
                    $out = array_merge($out, $res);
                }else{
                    //passano anche l'aggetto attributo
                    $res = QueryTitulusBuilder::simpleXmlObjectToArray($node);
                    $out[$index] = $res;
                }                
            } else {                                
                $out[$index] = $node;
            }
            
        }
        return $out;
    }

}