<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ParentContratto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('precontr', function (Blueprint $table) {
            $table->unsignedInteger('id_sorgente_rinnovo')->nullable();
            $table->text('motivazione_sorgente_rinnovo')->nullable();      

            $table->foreign('id_sorgente_rinnovo')
                ->references('id')
                ->on('precontr')
                ->onUpdate('cascade')
                ->onDelete('set null');  
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('precontr', function (Blueprint $table) {
            $table->dropColumn('id_sorgente_rinnovo');
            $table->dropColumn('motivazione_sorgente_rinnovo');

            $table->dropForeign(['id_sorgente_rinnovo']);            
        });
    }
}
