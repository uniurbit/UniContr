<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDossiersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dossiers', function (Blueprint $table) {
            //$table->id();
            $table->increments('id');   
            $table->timestamps();

            $table->string('dossier_id', 100)->unique();
            $table->string('titolo',255)->nullable();   

            $table->boolean('attivo')->default(0);
            $table->json('args')->nullable();

            $table->softDeletes();

        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dossiers');
    }
}
