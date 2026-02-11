<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Precontrattuale;
use Auth;

class SollecitoValidateEmail extends Mailable
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
        return $this->subject("[sollecito] Visione e accettazione contratto docenza UniUrb")     
        ->markdown('emails.sollecitovalidateemail')->with([
            'pre' => $this->pre,     
            'urlUniContr' => url(config('unidem.client_url').'/home/summary/'.$this->pre->insegn_id),      
        ]);    
        
    }
}
