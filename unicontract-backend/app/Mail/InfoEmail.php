<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Precontrattuale;
use Auth;

class InfoEmail extends Mailable
{
    use Queueable, SerializesModels;


    protected $pre;
    protected $entity;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Precontrattuale $pre, $entity)
    {
        $this->pre = $pre;
        $this->entity = $entity;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        
        return $this->from(Auth::user())  
            ->cc(Auth::user())          
            ->subject("Richiesta modifica/integrazioni modulistica precontrattuale")     
            ->markdown('emails.infoemail')->with([
                'pre' => $this->pre,     
                'entity' => $this->entity,
                'urlUniContr' => url(config('unidem.client_url').'/home/summary/'.$this->pre->insegn_id),      
        ]);
    }
}
