<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class A1Anagrafica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('a1_anagrafica', function (Blueprint $table) {
            $table->increments('id');
            $table->string('sesso', 1)->nullable();
            $table->string('nazione_nascita')->nullable();
            $table->string('comune_nascita')->nullable();
            $table->string('provincia_nascita', 2)->nullable();
            $table->date('data_nascita')->nullable();
            $table->string('cf_coniuge', 16)->nullable();
            $table->string('stato_civile')->nullable();
            $table->string('titolo_studio')->nullable();
            $table->string('nazione_residenza')->nullable();
            $table->string('comune_residenza')->nullable();
            $table->string('provincia_residenza', 2)->nullable();
            $table->string('cap_residenza', 5)->nullable();
            $table->string('indirizzo_residenza')->nullable();
            $table->string('civico_residenza', 10)->nullable();
            $table->date('data_variazione_residenza')->nullable();
            $table->string('comune_fiscale')->nullable();
            $table->string('provincia_fiscale', 2)->nullable();
            $table->string('cap_fiscale', 5)->nullable();
            $table->string('indirizzo_fiscale')->nullable();
            $table->string('civico_fiscale', 10)->nullable();
            $table->date('data_variazione_dom_fiscale')->nullable();
            $table->string('comune_comunicazioni')->nullable();
            $table->string('provincia_comunicazioni', 2)->nullable();
            $table->string('cap_comunicazioni', 5)->nullable();
            $table->string('indirizzo_comunicazioni')->nullable();
            $table->string('civico_comunicazioni', 10)->nullable();
            $table->string('telefono_abitazione', 20)->nullable();
            $table->string('telefono_cellulare', 20)->nullable();
            $table->string('telefono_ufficio', 60)->nullable();
            $table->string('fax', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('email_privata')->nullable();
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
        Schema::dropIfExists('a1_anagrafica');
    }
}
