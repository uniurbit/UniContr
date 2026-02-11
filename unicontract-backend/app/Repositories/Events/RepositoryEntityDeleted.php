<?php
namespace App\Repositories\Events;
/**
 * Class RepositoryEntityDeleted
 * @package App\Repositories\Events
 * 
 */
class RepositoryEntityDeleted extends RepositoryEventBase
{
    /**
     * @var string
     */
    protected $action = "deleted";
}