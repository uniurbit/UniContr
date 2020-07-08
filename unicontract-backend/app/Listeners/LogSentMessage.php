<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
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

    public function getPlainTextFromMessage(\Swift_Message $message)
    {
        $children = (array) $message->getChildren();

        foreach ($children as $child) {
            $childType = $child->getContentType();
            if ($childType === 'text/plain' && $child instanceof \Swift_MimePart) {
                return $child->getBody();
            }
        }

        return '';
    }

}
