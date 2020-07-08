<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SentEmail extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_sent_emails', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->morphs('model');

            //sender
            $table->unsignedInteger('sender_user_id'); 

            //receiver
            $table->unsignedInteger('receiver_docente_id')->nullable(); 
            //receiver 
            $table->string('receiver')->nullable();          
            //codifica
            $table->string('codifica')->nullable();             
            //oggetto
            $table->string('oggetto')->nullable();     
            //corpo_testo        
            $table->text('corpo_testo')->nullable();   
            //group_id        
            $table->string('group_id')->nullable();     

            $table->foreign('sender_user_id')
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
        //
    }
}
