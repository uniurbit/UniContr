<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Precontrattuale;
use Auth;

class ReportSegreterieEmail extends Mailable
{
    use Queueable, SerializesModels;

  
    protected $dip;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($dip, $document, $documentName)
    {
        $this->dip = $dip;
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
        return $this->subject("Elenco contratti di docenza ".$this->dip." non ancora stipulati")             
            ->markdown('emails.reportsegreteriemail')->with([                 
                'urlUniContr' => url(config('unidem.client_url').'/home/'),            
            ])
            ->attachData($this->document, $this->documentName, [
                'mime' => 'application/pdf',
            ]);  
    }
}
