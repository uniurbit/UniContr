<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableFamiliariACarico extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_familiari_a_carico', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('d6_detraz_fam_carico_id');
            $table->string('nome')->nullable();
            $table->string('cognome')->nullable();
            $table->string('parentela', 3)->nullable();
            $table->boolean('flag_disabilita')->default(0);
            $table->string('cod_fiscale', 16)->nullable();
            $table->date('data_nascita')->nullable();
            $table->string('percentuale_detrazione', 3)->nullable();
            $table->timestamps();

            $table->foreign('d6_detraz_fam_carico_id')
                  ->references('id')
                  ->on('d6_detraz_fam_carico');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_familiari_a_carico');
    }
}
