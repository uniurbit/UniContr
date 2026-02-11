<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class D3Tributari extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('d3_tributari', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_percepito')->default(0);
            $table->boolean('flag_limite_percepito')->default(0);
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
        Schema::dropIfExists('d3_tributari');
    }
}
