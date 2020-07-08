<?php

namespace App\Repositories\Events;

/**
 * Class RepositoryEntityUpdated
 * @package  App\Repositories\Events
 * 
 */

class RepositoryEntityUpdated extends RepositoryEventBase
{
    /**
     * @var string
     */
    protected $action = "updated";
}