<?php

namespace App\Listeners;
 
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
 
class LogRequestSending
{
    public function handle(object $event): void
    {
        Log::info('Richiesta HTTP: ', [
            'url' => $event->request->url(),            
            //'request_body' => $event->request->body()          
        ]);
    }
}