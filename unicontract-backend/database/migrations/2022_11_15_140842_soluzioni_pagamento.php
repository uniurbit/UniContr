<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SoluzioniPagamento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('a2_mod_pagamento', function (Blueprint $table) {
            $table->string('soluzione_pagamento', 20)->nullable();        
        });    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('a2_mod_pagamento', function($table) {
            $table->dropColumn('soluzione_pagamento');
        });
    }
}
