<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\Insegnamenti;
use Illuminate\Support\Facades\Log;

class CheckDipCod extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //'DIPARTIMENTO DI ECONOMIA, SOCIETA, POLITICA (DESP)'
        $insegnamenti = Insegnamenti::whereIn('aa',['2016','2017'])
            ->where('dipartimento','DIPARTIMENTO DI ECONOMIA, SOCIETA, POLITICA (DESP)')
            ->where('dip_cod',' ');

        $res = $insegnamenti->update(['dip_cod' => '004424'],['timestamps' => false]);
        
        Log::info('[ Aggiornati '.$res.' dip_cod ]'); 

        $insegnamenti = Insegnamenti::whereIn('aa',['2016','2017'])
            ->where('dipartimento','DIPARTIMENTO DI ECONOMIA, SOCIETA, POLITICA (DESP)')
            ->whereNull('dip_cod');
            
        $res = $insegnamenti->update(['dip_cod' => '004424'],['timestamps' => false]);        

        Log::info('[ Aggiornati '.$res.' dip_cod ]'); 

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
