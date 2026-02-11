<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class B1ConflInteressi extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('b1_confl_interessi', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_controll');
            $table->boolean('flag_quota');
            $table->boolean('flag_rappext');
            $table->boolean('flag_contrast');
            $table->boolean('flag_cariche');
            $table->boolean('flag_incarichi');
            $table->boolean('flag_attivita');
            $table->string('descr_attivita')->nullable();
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
        Schema::dropIfExists('b1_confl_interessi');
    }
}
