<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EOccasionale extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('e_autonomo_occasion', function (Blueprint $table) {
            $table->increments('id');
            $table->string('cod_limite_reddito', 4)->nullable();
            $table->smallInteger('gestione_separata')->default(0);
            $table->string('importo', 10)->nullable();
            $table->string('previdenza')->nullable();
            $table->string('cod_cassa_previdenziale', 3)->nullable();
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
        Schema::dropIfExists('e_autonomo_occasion');
    }
}
