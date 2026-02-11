<?php

namespace App\Listeners;
 
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
 
class LogResponseReceived
{
    public function handle(object $event): void
    {
        //Log::info($event->request);

        //Log::info($event->response);
     
        Log::info('Risposta HTTP: ', [
            'url' => $event->request->url(),
            'method' => $event->request->method(),
 //           'request_headers' => $event->request->headers(),
            'request_body' => $event->request->body(),
            'response_body' => $event->response->json() ?? $event->response->body(),
            'status_code' => $event->response->status()
        ]);
    }
}