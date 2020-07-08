<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Role;

class OpAmmEco extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $role = Role::where('name','op_approvazione_amm')->first();
        if ($role!=null){
            $role->givePermissionTo('view attachments');
        }

        $role = Role::where('name','op_approvazione_economica')->first();
        if ($role!=null){
            $role->givePermissionTo('view attachments');
        }

        $role = Role::where('name','op_approvazione')->first();
        if ($role!=null){
            $role->givePermissionTo('view attachments');
        }
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
