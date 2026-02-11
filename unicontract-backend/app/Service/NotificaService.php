<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Notifica;
use DB;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class NotificaService implements ApplicationService
{
    public function getNotifiche($riferimento, $precontr){

        $result = [];

        $toDay = Carbon::now()->setTimezone(config('unidem.timezone'))->format('Y-m-d');
        $notifiche = Notifica::where('stato','attivo')
            ->where('riferimento',$riferimento)
            ->whereDate('data_inizio','<=',$toDay)->whereDate('data_fine','>=',$toDay)->get();
        
        foreach ($notifiche as $notifica) {
           if ($this->isValid($notifica, $precontr)){
                array_push($result,$notifica);
           } 
        } 

        return $result;
    }
   
    private function isValid($notifica, $precontr){

        $result = false; 
        switch ($notifica->tipo_vincolo) {
            case 'vincolo_anno_rapporto':
                if ($precontr->insegnamento->aa == $notifica->dati->vincolo_anno){
                    if ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto == $notifica->dati->vincolo_natura_rapporto){
                        $result = true;
                    }
                }                
                break;
            
            default:
                $result = false;
                break;
        }

        return $result;
    }
}