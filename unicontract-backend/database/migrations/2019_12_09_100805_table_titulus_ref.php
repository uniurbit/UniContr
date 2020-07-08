<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TableTitulusRef extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_titulus_ref', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('insegn_id')->unsigned()->unique();
            $table->string('physdoc');
            $table->string('nrecord');
            $table->string('num_protocollo')->nullable();
            $table->string('num_repertorio')->nullable();
            $table->enum('bozza', ['si','no'])->nullable();   
            $table->boolean('signed')->default(0);
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
        Schema::dropIfExists('table_titulus_ref');
    }
}
