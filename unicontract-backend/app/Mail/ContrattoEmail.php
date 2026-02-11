<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Precontrattuale;
use Auth;

class ContrattoEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The pre instance.
     *
     * @var Order
     */
    protected $pre;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Precontrattuale $pre, $document, $documentName)
    {
        $this->pre = $pre;
        $this->document = $document;
        $this->documentName = $documentName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        
        return $this->subject("Contratto di insegnamento UniUrb")             
            ->markdown('emails.contrattomail')->with([
                'pre' => $this->pre,                 
            ])
            ->attachData($this->document, $this->documentName, [
                'mime' => 'application/pdf',
            ]);
    }
}
