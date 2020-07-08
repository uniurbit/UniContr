<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableRapportoUniv extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_rapporto_univ', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('b3_rapp_studio_univ_id');
            $table->string('universita')->nullable();
            $table->string('dipartimento')->nullable();
            $table->date('dal_giorno')->nullable();
            $table->date('al_giorno')->nullable();
            $table->string('tipologia_rapporto')->nullable();
            $table->string('riferimenti_legge', 30)->nullable();
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
        Schema::dropIfExists('table_rapporto_univ');
    }
}
