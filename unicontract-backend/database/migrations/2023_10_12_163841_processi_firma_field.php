<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ProcessiFirmaField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('processi_firma', function (Blueprint $table) {
            $table->string('file_id', 30)->nullable();  
            $table->string('link')->nullable();      
            $table->boolean('notify_assigned_user')->default(0);        
        }); 
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('processi_firma', function($table) {
            $table->dropColumn('file_id');
            $table->dropColumn('link');    
            $table->boolean('notify_assigned_user');          
        });
    }
}
