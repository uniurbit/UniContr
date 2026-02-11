<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TablePa extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_rapporto_pa', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('b4_rapp_pubbl_amm_id');
            $table->string('percentuale', 3)->nullable();
            $table->date('dal_giorno')->nullable();
            $table->date('al_giorno')->nullable();
            $table->date('data_aspettativa')->nullable();
            $table->string('denominazione_pa')->nullable();
            $table->string('cod_fisc_pa', 16)->nullable();
            $table->string('piva_pa', 13)->nullable();
            $table->string('comune_pa')->nullable();
            $table->string('provincia_pa', 2)->nullable();
            $table->string('indirizzo_pa')->nullable();
            $table->string('num_civico_pa', 10)->nullable();
            $table->string('cap_pa', 5)->nullable();
            $table->string('num_telefono_pa', 20)->nullable();
            $table->string('num_fax_pa', 20)->nullable();
            $table->string('email_pa')->nullable();
            $table->string('pec_pa')->nullable();
            $table->timestamps();

            $table->foreign('b4_rapp_pubbl_amm_id')
                  ->references('id')
                  ->on('b4_rapp_pubbl_amm');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_rapporto_pa');
    }
}
