<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProcessoFirmasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        // Id del processo
        // Nome
        // Tipo di documento (rappresentato da un codice)
        // Id dell’utente a cui è assegnato il processo
        // Stato: può assumere i seguenti valori:
            // Upload: in questo step è possibile effettuare l’upload dei documenti;
            // Confirm: in questo step è possibile vedere un riepilogo, ma non possono essere apportate modifiche;
            // Sent-to-user: step intermedio visualizzato nel caso in cui il processo sia stato creato e assegnato ad un altro utente.
            // Otp: il processo è in attesa dell’inserimento della coppia pin/otp per completare l’attività di firma;
            // Completed: il processo è terminato e tutti i documenti sono stati firmati.

        //U-SING
        Schema::create('processi_firma', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
       
            $table->string('process_id')->nullable(); 
            $table->string('process_name')->nullable();
            $table->string('document_type')->nullable();

            $table->string('assignee_email');
            $table->string('assignee_name')->nullable(); 
            $table->boolean('async')->default(0);
            $table->string('rejections',500)->nullable();

            $table->string('stato',30)->nullable(); 
            $table->string('step',30)->nullable(); 

            $table->string('tipo',30)->nullable();
            $table->unsignedInteger('precontr_id');
         
            $table->json('contenuto')->nullable();
           

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('processi_firma');
    }
}
