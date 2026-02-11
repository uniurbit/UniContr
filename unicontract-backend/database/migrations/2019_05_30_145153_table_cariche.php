<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableCariche extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_cariche', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('b1_confl_interessi_id');
            $table->string('ente');
            $table->string('carica');
            $table->string('oggetto', 250);
            $table->date('dal_giorno')->nullable();  
            $table->date('al_giorno')->nullable();  
            $table->decimal('compenso',12,2)->nullable();        
            $table->timestamps();

            $table->foreign('b1_confl_interessi_id')
                ->references('id')
                ->on('b1_confl_interessi');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_cariche');
    }
}
