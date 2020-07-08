<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MappingRuoli extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $tableNames = config('permission.table_names');

        Schema::create('mappingruoli', function (Blueprint $table) use ($tableNames) {
            $table->increments('id');  
            $table->timestamps();
            //riferimento ugov vista_org_attiva uo
            $table->string('unitaorganizzativa_uo', 20)->nullable();
            $table->string('descrizione_uo',255)->nullable();        

            $table->unsignedInteger('v_ie_ru_personale_id_ab')->nullable();              

            $table->unsignedInteger('role_id');

            $table->foreign('role_id')
                ->references('id')
                ->on($tableNames['roles']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mappingruoli');
    }
}
