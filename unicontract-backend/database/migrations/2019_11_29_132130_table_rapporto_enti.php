<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableRapportoEnti extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_rapporto_enti', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('d3_tributari_id');
            $table->string('ente')->nullable();
            $table->string('rapporto')->nullable();
            $table->date('dal_giorno')->nullable();
            $table->date('al_giorno')->nullable();
            $table->decimal('importo_totale',12,2)->nullable();  
            $table->decimal('importo_annuo',12,2)->nullable();  
            $table->timestamps();

            $table->foreign('d3_tributari_id')
                  ->references('id')
                  ->on('d3_tributari');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_rapporto_enti');
    }
}
