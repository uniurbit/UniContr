<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class D1Inps extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('d1_inps', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_obbligo_contributivo')->default(0);
            $table->boolean('flag_gestione_separata')->default(0);
            $table->boolean('flag_misura_ridotta')->default(0);
            $table->boolean('flag_partita_iva')->default(0);
            $table->string('specif_obbligo_contributivo', 3)->nullable();
            $table->string('specif_gestione_separata', 3)->nullable();
            $table->string('specif_misura_ridotta', 3)->nullable();
            $table->date('data_pensione')->nullable();
            $table->string('cassa_gestioni_previdenziali', 3)->nullable();
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
        Schema::dropIfExists('d1_inps');
    }
}
