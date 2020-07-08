<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class B5StatoPensionam extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('b5_stato_pensionam', function (Blueprint $table) {
            $table->increments('id');
            $table->string('status', 4)->nullable();
            $table->boolean('flag_rapp_collab_universita')->default(0);
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
        Schema::dropIfExists('b5_stato_pensionam');
    }
}
