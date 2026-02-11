<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class QuadroC extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('c_prestaz_profess', function (Blueprint $table) {
            $table->string('regime_fiscale', 10)->nullable();            
            $table->boolean('flag_regime_fiscale')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('c_prestaz_profess', function($table) {
            $table->dropColumn('regime_fiscale');
            $table->boolean('flag_regime_fiscale')->default(0)->change();
        });    
    }
}
