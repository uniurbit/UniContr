<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ContatoreInsegnamenti extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('p1_insegnamento', function (Blueprint $table) {
            $table->integer('contatore_insegnamenti_manuale')->nullable();        
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
            $table->dropColumn('contatore_insegnamenti_manuale');
        });
    }
}
