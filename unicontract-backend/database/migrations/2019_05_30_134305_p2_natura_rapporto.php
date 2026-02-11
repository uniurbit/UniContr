<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class P2NaturaRapporto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p2_natura_rapporto', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_rapp_studio_univ')->default(0);
            $table->boolean('flag_dipend_pubbl_amm')->default(0);
            $table->boolean('flag_titolare_pensione')->default(0);
            $table->string('natura_rapporto')->nullable();
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
        Schema::dropIfExists('p2_natura_rapporto');
    }
}
