<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Annullamento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('precontr', function (Blueprint $table) {
            $table->string('motivazione', 500)->change();
            $table->string('tipo_annullamento', 10)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('precontr', function($table) {
            $table->dropColumn('tipo_annullamento');
        });
    }
}
