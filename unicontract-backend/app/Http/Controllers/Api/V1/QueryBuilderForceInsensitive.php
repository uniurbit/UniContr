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

class QueryBuilderForceInsensitive extends QueryBuilder
{



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
        if ($where->operator == 'has') {
            //il value deve essere una relazione dichiarata 'comments' 'comments.author'
            if ($where->value){
                if (is_int($where->value)){
                    $query->has($where->field,'=',$where->value);
                } else {
                    $query->has($where->field,'=',DB::raw($where->value));
                }
            }else{
                $query->has($where->field);
            }                                    
        }else if ($where->operator == 'doesnthave') {
            if ($where->value){
                if (is_int($where->value)){
                    $query->has($where->field,'!=',$where->value);
                } else {
                    $query->has($where->field,'!=',DB::raw($where->value));
                }
            }else{
                $query->doesntHave($where->field);
            }
        }else if ($where->operator == 'In') {
            $query->whereIn($where->field, $where->value);
        } else if ( $where->operator == 'NotIn') {
            $query->whereNotIn($where->field, $where->value);
        }
        else if ( $where->operator == 'contains') {
            $query->where($where->field, 'like', '%'.$where->value.'%');
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
        //extract($where);
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
            $where->value = Carbon::createFromFormat(config('unidem.date_format'), $where->value)->format('Y-m-d');;
        }

        /** @var string $type */
        if ($where->operator == 'has') {
            //il value deve essere una relazione dichiarata 'comments' 'comments.author'
            if ($where->value){
                if (is_int($where->value)){
                    $this->query->has($where->field,'=',$where->value);
                } else {
                    $this->query->has($where->field,'=',DB::raw($where->value));
                }
            }else{
                $this->query->has($where->field);
            }                                    
        }else if ($where->operator == 'doesnthave') {
            if ($where->value){
                if (is_int($where->value)){
                    $this->query->has($where->field,'!=',$where->value);
                } else {
                    $this->query->has($where->field,'!=',DB::raw($where->value));
                }
            }else{
                $this->query->doesntHave($where->field);
            }            
        }else if ($where->operator == 'In') {
            $this->query->whereIn($where->field, $where->value);
        }else if ( $where->operator == 'NotIn') {
            $this->query->whereNotIn($where->field, $where->value);
        }else if ( $where->operator == 'contains') {
            if ($where->type == 'string'){
                $this->query->whereRaw('upper('.$where->field.') like ?', '%'.strtoupper($where->value).'%');
            }else{
                $this->query->where($where->field, 'like', '%'.$where->value.'%');                
            }            
        } else {
            if ( $where->value == '[null]') {
                if ( $where->operator == '=') {
                    $this->query->whereNull($where->field);
                } else {
                    $this->query->whereNotNull($where->field);
                }
            } else {
                if ($where->type == 'string'){
                    $this->query->whereRaw('upper('.$where->field.') '. $where->operator .' ?', strtoupper($where->value));
                }else{
                    $this->query->where($where->field, $where->operator, $where->value);
                }
            }
        }
    }

}

