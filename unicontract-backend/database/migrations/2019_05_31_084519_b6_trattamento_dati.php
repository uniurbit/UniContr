<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class B6TrattamentoDati extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('b6_trattamento_dati', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag1')->default(0);
            $table->boolean('flag2')->default(0);
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
        Schema::dropIfExists('b6_trattamento_dati');
    }
}
