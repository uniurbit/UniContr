<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Symfony\Component\Mime\Email;
use Illuminate\Support\Facades\Log;

class LogSentMessage
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        Log::info($event->message->getHeaders()->toString());
        Log::info($this->getPlainTextFromMessage($event->message));
    }

    public function getPlainTextFromMessage(Email $message)
    {
        // Check if plain text body is available directly
        $textBody = $message->getTextBody();
        if (!empty($textBody)) {
            return $textBody;
        }

        // If the text body is missing, log the available parts
        Log::info('No plain text body found. Available content types:');
        
        foreach ($message->getBody()->getParts() as $part) {
            Log::info('Part content type: ' . $part->getMediaType() . '/' . $part->getMediaSubtype());
        }

        return ''; // Return empty string if no text/plain part is found
    }

}
