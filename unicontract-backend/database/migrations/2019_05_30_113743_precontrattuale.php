<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Precontrattuale extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('precontr', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('insegn_id');
            $table->integer('p2_natura_rapporto_id')->unsigned()->nullable()->default(0);
            $table->integer('a1_anagrafica_id')->unsigned()->nullable()->default(0);
            $table->integer('a2_mod_pagamento_id')->unsigned()->nullable()->default(0);
            $table->integer('b1_confl_interessi_id')->unsigned()->nullable()->default(0);
            $table->integer('b2_incompatibilita_id')->unsigned()->nullable()->default(0);
            $table->integer('b3_rapp_studio_univ_id')->unsigned()->nullable()->default(0);
            $table->integer('b4_rapp_pubbl_amm_id')->unsigned()->nullable()->default(0);
            $table->integer('b5_stato_pensionam_id')->unsigned()->nullable()->default(0);
            $table->integer('b6_trattamento_dati_id')->unsigned()->nullable()->default(0);
            $table->integer('c_prestaz_profess_id')->unsigned()->nullable()->default(0);
            $table->integer('d1_inps_id')->unsigned()->nullable()->default(0);
            $table->integer('d2_inail_id')->unsigned()->nullable()->default(0);
            $table->integer('d3_tributari_id')->unsigned()->nullable()->default(0);
            $table->integer('d4_fiscali_id')->unsigned()->nullable()->default(0);
            $table->integer('d5_fiscali_resid_estero_id')->unsigned()->nullable()->default(0);
            $table->integer('d6_detraz_fam_carico_id')->unsigned()->nullable()->default(0);
            $table->integer('e_autonomo_occasionale_id')->unsigned()->nullable()->default(0);
            $table->integer('docente_id')->unsigned();
            
            $table->unsignedInteger('stato')->default(0);
            $table->dateTime('date_annullamento')->nullable();                           

            $table->boolean('flag_no_compenso')->default(0);
            $table->dateTime('date_flag_no_compenso')->nullable();
            
            $table->string('motivazione', 255)->nullable();
            $table->timestamps();

            $table->foreign('insegn_id')
                ->references('id')
                ->on('p1_insegnamento');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('precontr');
    }
}
