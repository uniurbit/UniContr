<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class LavoratriciMadri extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('a1_anagrafica', function (Blueprint $table) {
            $table->boolean('flag_lavoratrici_madri')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('a1_anagrafica', function($table) {
            $table->dropColumn('flag_lavoratrici_madri');
        });
    }
}
