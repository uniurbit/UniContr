<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFirmaRichiestesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

     //APPIO
    public function up()
    {
        Schema::create('richieste_firma', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->string('tipo',30)->nullable();
            $table->unsignedInteger('precontr_id');
            $table->string('signer_id')->nullable();
            $table->string('dossier_id')->nullable();
            $table->string('signature_request_id')->nullable();
            $table->string('document_id')->nullable();
            $table->json('contenuto')->nullable();
            $table->string('stato',30)->nullable();
            $table->string('rejected_reason')->nullable();
            $table->string('io_message_id')->nullable();

            $table->boolean('documenti_caricati')->default(0);
            $table->boolean('documenti_validati')->default(0);

            $table->foreign('precontr_id')
                ->references('id')
                ->on('precontr')
                ->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('richieste_firma');
    }
}
