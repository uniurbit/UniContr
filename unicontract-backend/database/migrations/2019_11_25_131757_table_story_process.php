<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableStoryProcess extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_story_process', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('insegn_id')->nullable();
            $table->unsignedInteger('precontr_id');
            $table->text('descrizione')->nullable();
            $table->unsignedInteger('user_id')->nullable();
            $table->string('codice',10)->nullable();
            $table->timestamps();

            $table->foreign('precontr_id')
                ->references('id')
                ->on('precontr')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_story_process');
    }
}
