<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class A2ModPagamento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('a2_mod_pagamento', function (Blueprint $table) {
            $table->increments('id');
            $table->string('modality', 4)->nullable();
            $table->string('tipologia_conto_corrente', 3)->nullable();
            $table->string('iban', 27)->nullable();
            $table->string('bic', 15)->nullable();            
            $table->string('denominazione')->nullable();
            $table->string('luogo')->nullable();
            $table->string('intestazione')->nullable();
            $table->string('aba', 12)->nullable();
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
        Schema::dropIfExists('a2_mod_pagamento');
    }
}
