<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class D6DetrazFamCarico extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('d6_detraz_fam_carico', function (Blueprint $table) {
            $table->increments('id');
            $table->boolean('flag_richiesta_detrazioni')->default(0);
            $table->boolean('flag_coniuge_carico')->default(0);
            $table->date('dal_giorno')->nullable();
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
        Schema::dropIfExists('d6_detraz_fam_carico');
    }
}
