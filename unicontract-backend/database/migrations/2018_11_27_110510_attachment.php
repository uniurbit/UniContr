<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;


//php artisan migrate:rollback
//php artisan migrate:fresh --seed
//php artisan db:seed --class=DatiSeeder
class Attachment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('attachmenttypes', function (Blueprint $table) {
            $table->increments('id');                
            $table->string('codice', 25)->unique();                
            $table->string('descrizione',255);
            $table->string('descrizione_compl')->nullable();
            $table->string('gruppo')->nullable();     
            $table->string('parent_type')->nullable();
            $table->integer('parent_id')->unsigned()->nullable();
        });

        Schema::create('attachments', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('uuid')->index();
            $table->string('disk', 32);
            $table->string('filepath', 512);
            $table->string('filename', 255);
            $table->string('filetype', 512);
            $table->unsignedInteger('filesize');
            $table->string('key', 64)->nullable();
            $table->string('title', 92)->nullable();
            $table->text('description')->nullable();
            $table->string('preview_url', 512)->nullable();
            $table->string('group')->nullable();
            
            //da Titulus
            $table->string('nrecord')->nullable(); 
            //da Titulus numero di protocollo
            $table->string('num_prot')->nullable(); 
            //da Titulus numero di repertorio
            $table->string('num_rep')->nullable();             

            //data di creazione del documento
            $table->date('emission_date')->nullable();
            //numero documento
            $table->string('docnumber')->nullable();
            //data di scadenza
            $table->date('expiration_date')->nullable();

            $table->morphs('model');
            $table->longText('metadata')->nullable();
            $table->string('attachmenttype_codice',25);  
            $table->timestamps();

            $table->foreign('attachmenttype_codice')
                ->references('codice')
                ->on('attachmenttypes');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {        
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('attachmenttypes');
    }
}
