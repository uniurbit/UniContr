<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Detrazioni21 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('d4_fiscali', function (Blueprint $table) {

            $table->boolean('flag_detrazioni_21_2020')->nullable(true);
            $table->string('detrazioni_21_2020', 4)->nullable();
            $table->decimal('reddito_21_2020',12,2)->nullable();  
           
            $table->boolean('flag_bonus_renzi')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('d4_fiscali', function($table) {
            $table->dropColumn('flag_detrazioni_21_2020');
            $table->dropColumn('detrazioni_21_2020');
            $table->dropColumn('reddito_21_2020');

            $table->boolean('flag_bonus_renzi')->default(0)->change();
        });
    }
}
