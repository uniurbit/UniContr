<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MotivazioneContatoreInsegnamenti extends Migration
{
 /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p1_insegnamento', function (Blueprint $table) {
            $table->text('motivazione_contatore')->nullable();        
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
            $table->dropColumn('motivazione_contatore');
        });
    }
}
