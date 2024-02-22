<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CdsCod extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p1_insegnamento', function (Blueprint $table) {
            $table->string('cds_cod', 20)->nullable(); 
        }); 
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        
        Schema::table('p1_insegnamento', function($table) {
            $table->dropColumn('cds_cod');
        });
    }
}
