<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class D4Fiscali extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('d4_fiscali', function (Blueprint $table) {
            $table->increments('id');            
            $table->string('percentuale_aliquota_irpef', 3)->nullable();
            $table->boolean('flag_detrazioni')->default(0);
            $table->string('detrazioni', 3)->nullable();
            $table->string('reddito')->nullable();
            $table->boolean('flag_bonus_renzi')->default(0);
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
        Schema::dropIfExists('d4_fiscali');
    }
}
