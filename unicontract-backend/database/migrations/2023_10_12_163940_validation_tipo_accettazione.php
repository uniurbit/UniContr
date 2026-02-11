<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ValidationTipoAccettazione extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('table_validation', function (Blueprint $table) {
            $table->string('tipo_accettazione', 20)->nullable()->after('flag_accept');  //PRESA_VISIONE, FIRMAIO, USIGN
        }); 
        
        //manca il where ...
        DB::table('table_validation')
            ->where('flag_accept',true)
            ->update([
                'tipo_accettazione' => 'PRESA_VISIONE'
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('table_validation', function($table) {
            $table->dropColumn('tipo_accettazione');
        });
    }
}
