<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ErrorNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $errorMessage;

    /**
     * Create a new message instance.
     *
     * @param string $errorMessage
     * @return void
     */
    public function __construct($errorMessage)
    {
        $this->errorMessage = $errorMessage;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->subject('Errore nel comando SearchDataTitulusSendEmails')
            ->with(['errorMessage' => $this->errorMessage])
            ->view('emails.errorNotification'); // Create a corresponding view
    }
}