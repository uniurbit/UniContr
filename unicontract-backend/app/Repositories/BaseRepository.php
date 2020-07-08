<?php

namespace App\Repositories;

use App\Repositories\RepositoryInterface;
use App\Repositories\RepositoryException;
use App\Repositories\Events\RepositoryEntityUpdated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Container\Container as App;
use App\Repositories\Events\RepositoryEntityCreated;
 
/**
 * Class Repository
 * 
 */
abstract class BaseRepository implements RepositoryInterface {
 
   /**
     * @var App
     */
    private $app;
 
    /**
     * @var
     */
    protected $model;
 

    /**
     * @param App $app
     * @throws RepositoryException
     */
    public function __construct(App $app) {
        $this->app = $app;
        $this->makeModel();
        $this->boot();
    }
 
    /**
     *
     */
    public function boot()
    {
        //
    }

    /**
     * @throws RepositoryException
     */
    public function resetModel()
    {
        $this->makeModel();
    }

    /**
     * Specify Model class name
     *
     * @return mixed
     */
    abstract function model();
 
    /**
     * @param array $columns
     * @return mixed
     */
    public function all($columns = array('*')) {
        return $this->model->get($columns);
    }
 
    /**
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginate($perPage = 1, $columns = array('*')) {
        return $this->model->paginate($perPage, $columns);
    }
 
    /**
     * Find data by multiple fields
     *
     * @param array $where
     * @param array $columns
     *
     * @return mixed
     */
    public function findWhere(array $where, $columns = ['*'])
    {        
        $this->applyConditions($where);
        $model = $this->model->get($columns);
        $this->resetModel();
        return $this->parserResult($model);
    }

     /**
     * Save a new entity in repository
     *
     *
     * @param array $attributes
     *
     * @return mixed
     */
    public function create(array $data) {
        $model = $this->model->create($data);
        $this->resetModel();

        event(new RepositoryEntityCreated($this, $model));

        return $model;
    }
 
    /**
     * Update a entity in repository by id
     *
     *
     * @param array $attributes
     * @param       $id
     *
     * @return mixed
     */
    public function update(array $data, $id, $attribute="id") {

        $model = $this->model->findOrFail($id);        

        $model->validate();
        $model->update($data);
        
        //$model = $this->model->where($attribute, '=', $id)->update($data);

        $this->resetModel();

        event(new RepositoryEntityUpdated($this, $model));

        return $model;
    }
 
    /**
     * Update or Create an entity in repository
     *
     * @throws ValidatorException
     *
     * @param array $attributes
     * @param array $values
     *
     * @return mixed
     */
    public function updateOrCreate(array $attributes, array $values = [])
    {        
        $model = $this->model->updateOrCreate($attributes, $values);        
        $this->resetModel();
        event(new RepositoryEntityUpdated($this, $model));
        return $this->parserResult($model);
    }



    /**
     * @param $id
     * @return mixed
     */
    public function delete($id) {
        $model = $this->model->find($id);
        return $model->delete();
    }
 
    /**
     * @param $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = array('*')) {
        return $this->model->find($id, $columns);
    }
 
    /**
     * @param $attribute
     * @param $value
     * @param array $columns
     * @return mixed
     */
    public function findBy($attribute, $value, $columns = array('*')) {
        return $this->model->where($attribute, '=', $value)->first($columns);
    }
 

    public function orderBy($column, $direction = 'asc')
    {
        $this->model = $this->model->orderBy($column, $direction);
        return $this;
    }

     /**
     * Check if entity has relation
     *
     * @param string $relation
     *
     * @return $this
     */
    public function has($relation)
    {
        $this->model = $this->model->has($relation);
        return $this;
    }

    /**
     * Load relations
     *
     * @param array|string $relations
     *
     * @return $this
     */
    public function with($relations)
    {
        $this->model = $this->model->with($relations);
        return $this;
    }
    /**
     * Add subselect queries to count the relations.
     *
     * @param  mixed $relations
     * @return $this
     */
    public function withCount($relations)
    {
        $this->model = $this->model->withCount($relations);
        return $this;
    }

    /**
     * Load relation with closure
     *
     * @param string $relation
     * @param closure $closure
     *
     * @return $this
     */
    public function whereHas($relation, $closure)
    {
        $this->model = $this->model->whereHas($relation, $closure);
        return $this;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder
     * @throws RepositoryException
     */
    public function makeModel() {
        $model = $this->app->make($this->model());
 
        if (!$model instanceof Model)
            throw new RepositoryException("Class {$this->model()} must be an instance of Illuminate\\Database\\Eloquent\\Model");
 
        return $this->model = $model->newQuery();
    }   

     /**
     * Applies the given where conditions to the model.
     *
     * @param array $where
     * @return void
     */
    protected function applyConditions(array $where)
    {
        foreach ($where as $field => $value) {
            if (is_array($value)) {
                list($field, $condition, $val) = $value;
                $this->model = $this->model->where($field, $condition, $val);
            } else {
                $this->model = $this->model->where($field, '=', $value);
            }
        }
    }


}