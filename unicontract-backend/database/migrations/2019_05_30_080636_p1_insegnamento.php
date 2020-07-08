<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class P1Insegnamento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('p1_insegnamento', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('coper_id')->unsigned()->nullable();
            $table->string('ruolo', 4)->nullable();
            $table->string('insegnamento', 255)->nullable();
            $table->string('settore', 255)->nullable();
            $table->string('cod_settore', 50)->nullable();
            $table->integer('cfu')->unsigned()->nullable();
            $table->integer('ore')->unsigned()->nullable();
            $table->string('cdl', 255)->nullable();
            $table->date('data_ini_contr')->nullable();
            $table->date('data_fine_contr')->nullable();
            $table->string('ciclo', 255)->nullable();
            $table->string('aa', 11)->nullable();
            $table->string('dipartimento', 255)->nullable();
            $table->decimal('compenso',12,2)->nullable();     
            //$table->string('compenso', 9)->nullable();
            $table->string('tipo_contratto', 10)->nullable();
            $table->string('tipo_atto', 255)->nullable();
            $table->string('emittente', 255)->nullable();
            $table->string('motivo_atto', 30)->nullable();
            $table->string('num_delibera', 30)->nullable();
            $table->date('data_delibera')->nullable();
            $table->string('cod_insegnamento', 20)->nullable();
            $table->tinyInteger('stato', false, true)->default(0);
            $table->smallInteger('storico', false, true)->default(0);
            $table->string('user_role', 30)->default('NULL');
            
            //codice dipartimento
            $table->string('dip_cod', 10)->nullable();
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
        Schema::dropIfExists('p1_insegnamento');
    }
}
