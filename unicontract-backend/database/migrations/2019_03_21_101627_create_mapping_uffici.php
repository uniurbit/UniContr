<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

// php artisan migrate:fresh --seed
// php artisan make:migration create_mapping_uffici
class CreateMappingUffici extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mappinguffici', function (Blueprint $table) {
            $table->increments('id');                

            //riferimento ugov vista_org_attiva uo
            $table->string('unitaorganizzativa_uo', 20)->unique();                
            $table->string('descrizione_uo',255);            

            //riferimento titulus cod_uff
            $table->string('strutturainterna_cod_uff', 20);                
            $table->string('descrizione_uff',255);                        

            //$table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mappinguffici');
    }
}
