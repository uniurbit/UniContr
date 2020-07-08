<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class B4RappPubblAmm extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('b4_rapp_pubbl_amm', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo_rapporto', 4)->nullable(); 
            $table->boolean('tempo_pieno')->default(0);
            $table->boolean('iscrizione_albo')->default(0);
            $table->string('descrizione_albo')->nullable();
            $table->boolean('attivita_professionale')->default(0);
            $table->string('descrizione_attivita')->nullable();
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
        Schema::dropIfExists('b4_rapp_pubbl_amm');
    }
}
