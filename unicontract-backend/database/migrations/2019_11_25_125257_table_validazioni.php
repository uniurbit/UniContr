<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableValidazioni extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_validation', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('insegn_id')->unsigned();
            $table->boolean('flag_submit')->default(0);
            $table->dateTime('date_submit')->nullable();
            $table->boolean('flag_upd')->default(0);
            $table->dateTime('date_upd')->nullable();
            $table->boolean('flag_amm')->default(0);
            $table->dateTime('date_amm')->nullable();
            $table->boolean('flag_make')->default(0);
            $table->dateTime('date_make')->nullable();
            $table->boolean('flag_accept')->default(0);
            $table->dateTime('date_accept')->nullable();
            $table->string('current_place')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_validation');
    }
}
