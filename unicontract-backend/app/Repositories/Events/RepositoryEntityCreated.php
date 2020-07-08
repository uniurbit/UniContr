<?php
namespace App\Repositories\Events;
/**
 * Class RepositoryEntityCreated
 * @package App\Repositories\Events
 */

class RepositoryEntityCreated extends RepositoryEventBase
{
    /**
     * @var string
     */
    protected $action = "created";
}