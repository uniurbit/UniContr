<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AttachmentType extends Model
{
    protected $table = 'attachmenttypes';
    protected $hidden = ['parent_type', 'parent_id'];

}
