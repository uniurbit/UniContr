<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Precontrattuale;
use Auth;

class FirmaEmail extends Mailable
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
    public function __construct(Precontrattuale $pre)
    {
        $this->pre = $pre;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        
        return $this->subject("Avvenuta accettazione contratto di insegnamento ".$this->pre->user->nameTutorString())     
        ->markdown('emails.firmaemail')->with([
            'pre' => $this->pre,     
            'urlUniContr' => url("https://titulus-uniurb.cineca.it/xway/application/xdocway/engine/xdocway.jsp?verbo=queryplain&codammaoo=UNURCLE&query=%5B%2F%2F%40physdoc%5D%3D".$this->pre->titulusref->physdoc),      
        ]);    
        
    }
}
