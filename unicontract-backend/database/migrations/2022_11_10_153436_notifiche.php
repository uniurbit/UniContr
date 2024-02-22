<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Notifiche extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifiche', function (Blueprint $table) {
            $table->increments('id');                            

            $table->text('messaggio');            
            $table->string('riferimento',50)->nullable(); //contratto 
            $table->string('priorita',50)->nullable();  //success, info, warning, ...

            $table->dateTime('data_inizio')->nullable();            
            $table->dateTime('data_fine')->nullable();            
            
            $table->json('dati')->nullable(); //vincolo_anno e vincolo_tipo contratto            
            $table->unsignedInteger('user_id');

            $table->string('tipo_vincolo', 50);             
            $table->string('stato', 10); //attivo disattivo

            $table->softDeletes();
            $table->timestamps();         
            
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
        Schema::dropIfExists('notifiche');
    }
}
