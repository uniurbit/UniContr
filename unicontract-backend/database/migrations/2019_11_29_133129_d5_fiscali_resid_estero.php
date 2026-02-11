<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class D5FiscaliResidEstero extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('d5_fiscali_resid_estero', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_convenzione_bilaterale')->default(0);
            $table->boolean('flag_gestione_separata')->default(0);
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
        Schema::dropIfExists('d5_fiscali_resid_estero');
    }
}
