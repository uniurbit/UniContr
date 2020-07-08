<?php
namespace App\Http\Controllers\Api\V1;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator as BasePaginator;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Exceptions\UnknownColumnException;
use App\FindParameter;
use Carbon\Carbon;

class QueryBuilder
{

    protected $constantParameters = [
        'order_by',
        'group_by',
        'limit',
        'page',
        'columns',
        'includes',
        'appends'
    ];
    protected $request;

    protected $model;
    protected $findParameter;

    protected $wheres = [];

    protected $withwheres = [];

    protected $orderBy = [];
    protected $limit;
    protected $page = 1;
    protected $offset = 0;
    protected $columns = ['*'];
    protected $relationColumns = [];
    protected $includes = [];
    protected $groupBy = [];
    protected $excludedParameters = [];
    protected $appends = [];
    protected $query;
    protected $result;

    public function __construct() 
    { 
        $a = func_get_args(); 
        $i = func_num_args(); 
        if (method_exists($this,$f='__construct'.$i)) { 
            call_user_func_array(array($this,$f),$a); 
        } 
    } 

    public function __construct2(Model $model, Request $request)
    {
        $this->request = $request;
        $this->orderBy = config('querybuilder.orderBy');
        $this->limit = config('querybuilder.limit');
        $this->excludedParameters = array_merge($this->excludedParameters, config('querybuilder.excludedParameters'));
        $this->model = $model;
        
        $this->findParameter = new \App\FindParameter($request->json()->all());      

        $this->query = $this->model->newQuery();
    }

    public function __construct3(Model $model, ?Request $request, FindParameter $findParameter)
    {
        $this->request = $request;
        $this->orderBy = config('querybuilder.orderBy');
        $this->limit = config('querybuilder.limit');
        $this->excludedParameters = array_merge($this->excludedParameters, config('querybuilder.excludedParameters'));
        $this->model = $model;
        
        $this->findParameter = $findParameter;      

        $this->query = $this->model->newQuery();
    }



    public function build()
    {
        $this->prepare();
       
        if ($this->hasWheres()) {
            array_map([$this, 'addWhereToQuery'], $this->wheres);
        }
        if ($this->hasGroupBy()) {
            $this->query->groupBy($this->groupBy);
        }
        if ($this->hasLimit()) {
            $this->query->take($this->limit);
        }
        if ($this->hasOffset()) {
            $this->query->skip($this->offset);
        }
        array_map([$this, 'addOrderByToQuery'], $this->orderBy);       
        $this->query->with($this->includes);
        if ($this->hasWithWheres()) {
            array_walk($this->includes,[$this, 'addWhereHas']);
        }
        $this->query->select($this->columns);
        return $this;
    }
    public function get()
    {
        $result = $this->query->get();
        if ($this->hasAppends()) {
            $result = $this->addAppendsToModel($result);
        }
        return $result;
    }
    public function paginate()
    {
        if (!$this->hasLimit()) {
            throw new Exception("You can't use unlimited option for pagination", 1);
        }
        $result = $this->basePaginate($this->limit,['*'],'page', $this->page);
        if ($this->hasAppends()) {
            $result = $this->addAppendsToModel($result);
        }
        return $result;
    }
    public function lists($value, $key)
    {
        return $this->query->lists($value, $key);
    }
    protected function prepare()
    {
        $this->setWheres($this->findParameter);

        $constantParameters = $this->constantParameters;
        array_map([$this, 'prepareConstant'], $constantParameters);
        if ($this->hasIncludes() && $this->hasRelationColumns()) {
            $this->fixRelationColumns();
        }
        return $this;
    }

    private function prepareConstant($parameter)
    {

        //di tutte le costanti imposta i valori passati come parametro 
        // 'order_by',
        // 'group_by',
        // 'limit',
        // 'page',
        // 'columns',
        // 'includes',
        // 'appends'


        if (!$this->findParameter->hasQueryParameter($parameter)) {
            return;
        }
        $callback = [$this, $this->setterMethodName($parameter)];
        $callbackParameter = $this->findParameter[$parameter];        
        call_user_func($callback, $callbackParameter);
    }
    private function setIncludes($includes)
    {
        $this->includes = array_filter(explode(',', $includes));
    }
    private function setPage($page)
    {
        $this->page = (int)$page;
        $this->offset = ($page - 1) * $this->limit;
    }
    private function setColumns($columns)
    {
        $columns = array_filter(explode(',', $columns));
        $this->columns = $this->relationColumns = [];
        array_map([$this, 'setColumn'], $columns);
    }
    private function setColumn($column)
    {
        if ($this->isRelationColumn($column)) {
            return $this->appendRelationColumn($column);
        }
        $this->columns[] = $column;
    }
    private function appendRelationColumnCondition($where)
    {
        list($key, $column) = explode('.', $where->field);
        $where->field = $column;
        $this->withwheres[$key][] = $where;
    }
    private function appendRelationColumn($keyAndColumn)
    {
        list($key, $column) = explode('.', $keyAndColumn);
        $this->relationColumns[$key][] = $column;
    }
    private function fixRelationColumns()
    {
        $keys = array_keys($this->relationColumns);
        $callback = [$this, 'fixRelationColumn'];
        array_map($callback, $keys, $this->relationColumns);
    }
    private function fixRelationColumn($key, $columns)
    {
        $index = array_search($key, $this->includes);
        //elimino  il contenuto se fosse già presente
        unset($this->includes[$index]);        
        $this->includes[$key] = $this->closureRelationColumns($columns, array_key_exists($key, $this->withwheres) ? $this->withwheres[$key] : []);
    }
    private function closureRelationColumns($columns, $wheres)
    {
        return function ($q) use ($columns, $wheres) {           
            if (count($wheres) > 0){
                array_map(function($condition) use($q){ 
                    $this->addWhereToWithQuery($condition, $q); 
                }, $wheres);
            }
            $q->select($columns);
        };
    }
    private function setOrderBy($order)
    {
        $this->orderBy = [];
        $orders = array_filter(explode('|', $order));
        array_map([$this, 'appendOrderBy'], $orders);
    }
    private function appendOrderBy($order)
    {
        if ($order == 'random') {
            $this->orderBy[] = 'random';
            return;
        }
        list($column, $direction) = explode(',', $order);
        $this->orderBy[] = [
            'column' => $column,
            'direction' => $direction
        ];
    }
    private function setGroupBy($groups)
    {
        $this->groupBy = array_filter(explode(',', $groups));
    }
    private function setLimit($limit)
    {
        $limit = ($limit == 'unlimited') ? null : (int)$limit;
        $this->limit = $limit;
    }
    private function setWheres($parameters)
    {
        array_map([$this, 'setWhere'], $parameters->rules);
    }
    private function setWhere($where){
        if ($this->isRelationColumn($where->field)){
            return $this->appendRelationColumnCondition($where);
        }else{
            $this->wheres[] = $where;
        }
    }    

    private function setAppends($appends)
    {
        $this->appends = explode(',', $appends);
    }
    private function addWhereHas($funct,$key){
        
        if (is_callable($funct)){
            $this->query->whereHas($key,$funct);
        }else{        
            $key = $funct;
            $wheres = array_key_exists($key, $this->withwheres) ? $this->withwheres[$key] : [];
            if (count($wheres) > 0){
                $this->includes[$key] = function ($q) use ($wheres) {           
                        if (count($wheres) > 0){
                            array_map(function($condition) use($q){ 
                                $this->addWhereToWithQuery($condition, $q); 
                            }, $wheres);
                        }                              
                    };
            }
            // array include risultante
            //0:"insegnamento"
            //1:"user"
            //insegnamento:Closure
            //user:Closure 
            //evitare la whereHas
            //$this->query->whereHas($key,$this->includes[$key]);
        }
        

    }
    protected function addWhereToWithQuery($where, $query)
    {        
        // For array values (whereIn, whereNotIn)
        if (isset($where->values)) {
            $value = $values;
        }
        if (!isset($where->operator)) {
            $operator = '';
        }
        /** @var mixed $key */
        if ($this->isExcludedParameter($where->field)) {
            return;
        }            
        
        if ($where->type == 'date'){
            $where->value = Carbon::createFromFormat(config('unidem.date_format'), $where->value)->format('Y-m-d');
        }
        
        //TODO se la connessione Oracle va saltato
        //if (!$this->hasTableColumn($where->field)) {
        //    throw new UnknownColumnException("Unknown column '{$where->field}'");
        //}

        /** @var string $type */
        if ($where->operator == 'In') {
            $query->whereIn($where->field, $where->value);
        } else if ( $where->operator == 'NotIn') {
            $query->whereNotIn($where->field, $where->value);
        }
        else if ( $where->operator == 'contains') {
            $query->where($where->field, 'like', '%'.$where->value.'%');
        } else if ( $where->operator == '!=') {
            $query->whereNotIn($where->field, [$where->value]);
        } else {
            if ( $where->value === '[null]') {
                if ( $where->operator == '=') {
                    $query->whereNull($where->field);
                } else {
                    $query->whereNotNull($where->field);
                }
            } else {
                $query->where($where->field, $where->operator, $where->value);
            }
        }
    }

    protected function addWhereToQuery($where)
    {        
        // For array values (whereIn, whereNotIn)
        if (isset($where->values)) {
            $value = $values;
        }
        if (!isset($where->operator)) {
            $operator = '';
        }
        /** @var mixed $key */
        if ($this->isExcludedParameter($where->field)) {
            return;
        }        
        if ($this->hasCustomFilter($where->field)) {
            /** @var string $type */
            return $this->applyCustomFilter($where->field, $where->operator,  $where->value,  $where->type);
        }
        //TODO se la connessione Oracle va saltato
        // if (!$this->hasTableColumn($where->field)) {
        //    throw new UnknownColumnException("Unknown column '{$where->field}'");
        // }
        if ($where->type == 'date'){
            $where->value = Carbon::createFromFormat(config('unidem.date_format'), $where->value)->format('Y-m-d');
        }

        /** @var string $type */
        if ($where->operator == 'In') {
            $this->query->whereIn($where->field, $where->value);
        } else if ( $where->operator == 'NotIn') {
            $this->query->whereNotIn($where->field, $where->value);
        }
        else if ( $where->operator == 'contains') {
            $this->query->where($where->field, 'like', '%'.$where->value.'%');
        } else if ( $where->operator == '!=') {
            $this->query->whereNotIn($where->field, [$where->value]);
        } else {
            if ( $where->value === '[null]') {
                if ( $where->operator == '=') {
                    $this->query->whereNull($where->field);
                } else {
                    $this->query->whereNotNull($where->field);
                }
            } else {
                $this->query->where($where->field, $where->operator, $where->value);
            }
        }
    }
    private function addOrderByToQuery($order)
    {
        if ($order == 'random') {
            return $this->query->orderBy(DB::raw('RAND()'));
        }
        extract($order);
        /** @var string $column */
        /** @var string $direction */
        $this->query->orderBy($column, $direction);
    }
    private function applyCustomFilter($key, $operator, $value, $type = 'Basic')
    {
        $callback = [$this, $this->customFilterName($key)];
        $this->query = call_user_func($callback, $this->query, $value, $operator, $type);
    }
    private function isRelationColumn($column)
    {
        return (count(explode('.', $column)) > 1);
    }
    protected function isExcludedParameter($key)
    {
        return in_array($key, $this->excludedParameters);
    }
    private function hasWithWheres()
    {
        return (count($this->withwheres) > 0);
    }
    private function hasWheres()
    {
        return (count($this->wheres) > 0);
    }
    private function hasIncludes()
    {
        return (count($this->includes) > 0);
    }
    private function hasAppends()
    {
        return (count($this->appends) > 0);
    }
    private function hasGroupBy()
    {
        return (count($this->groupBy) > 0);
    }
    private function hasLimit()
    {
        return ($this->limit);
    }
    private function hasOffset()
    {
        return ($this->offset != 0);
    }
    private function hasRelationColumns()
    {
        return (count($this->relationColumns) > 0);
    }
    private function hasTableColumn($column)
    {
        return (Schema::hasColumn($this->model->getTable(), $column));
    }
    protected function hasCustomFilter($key)
    {
        $methodName = $this->customFilterName($key);
        return (method_exists($this, $methodName));
    }
    private function setterMethodName($key)
    {
        return 'set' . studly_case($key);
    }
    private function customFilterName($key)
    {
        return 'filterBy' . studly_case($key);
    }
    private function addAppendsToModel($result)
    {
        $result->map(function ($item) {
            $item->append($this->appends);
            return $item;
        });
        return $result;
    }
    /**
     * Paginate the given query.
     *
     * @param  int $perPage
     * @param  array $columns
     * @param  string $pageName
     * @param  int|null $page
     * @return Paginator
     *
     * @throws \InvalidArgumentException
     */
    private function basePaginate($perPage = null, $columns = ['*'], $pageName = 'page', $page = null)
    {
        $page = $page ?: BasePaginator::resolveCurrentPage($pageName);
        $perPage = $perPage ?: $this->model->getPerPage();
        if (method_exists($this->query, 'toBase')) {
            $query = $this->query->toBase();
        } else {
            $query = $this->query->getQuery();
        }
        $total = $query->getCountForPagination();
        $results = $total ? $this->query->forPage($page, $perPage)->get($columns) : new Collection;
      
        return (new Paginator($results, $total, $perPage, $page, [
            'path' => BasePaginator::resolveCurrentPath(),
            'pageName' => $pageName            
        ])); 
    }

    public function noPagination($columns = ['*']){
        if (method_exists($this->query, 'toBase')) {
            $query = $this->query->toBase();
        } else {
            $query = $this->query->getQuery();
        }        
        $results =  $this->query->get($columns);
        
        if ($results==null){
            $results = new Collection;
        }
        if ($this->hasAppends()) {
            $results = $this->addAppendsToModel($results);
        }
        return $results;
    }
}