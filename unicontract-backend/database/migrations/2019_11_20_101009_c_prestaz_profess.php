<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CPrestazProfess extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('c_prestaz_profess', function (Blueprint $table) {
            $table->increments('id');
            $table->string('piva', 11)->nullable();
            $table->string('intestazione')->nullable();
            $table->boolean('tipologia')->default(0);
            $table->boolean('flag_albo')->default(0);
            $table->string('denominazione_albo')->nullable();
            $table->string('provincia_albo')->nullable();
            $table->string('num_iscrizione_albo')->nullable();
            $table->date('data_iscrizione_albo')->nullable();
            $table->boolean('flag_cassa')->default(0);
            $table->string('denominazione_cassa')->nullable();
            $table->boolean('contributo_cassa')->default(0);
            $table->boolean('flag_rivalsa')->default(0);
            $table->boolean('flag_regime_fiscale')->default(0);
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
        Schema::dropIfExists('c_prestaz_profess');
    }
}
