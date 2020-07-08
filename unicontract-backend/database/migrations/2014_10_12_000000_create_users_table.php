<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    
    /**
     * Run the migrations.
     *
     * @return void
     */

     
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('v_ie_ru_personale_id_ab')->nullable();  
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            
            $table->date('blocked_date')->nullable();

            $table->rememberToken();
            $table->timestamps();
            $table->string('cf', 16)->nullable();
            $table->string('nome')->nullable();
            $table->string('cognome')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    
    public function down()
    {
        Schema::dropIfExists('users');
    }
    
}
