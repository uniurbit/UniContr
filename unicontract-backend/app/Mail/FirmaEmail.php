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
     * @var Contratto
     */
    protected $pre;
    protected $url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Precontrattuale $pre, $url)
    {
        $this->pre = $pre;
        $this->url = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {        

        //try {
        //$url = TitulusHelper::getTitulusUrl($this->pre->titulusref->physdoc)['url'];
        // } catch (\Throwable $th) {
        //     $url =  url("https://titulus-uniurb.cineca.it/xway/application/xdocway/engine/xdocway.jsp?verbo=queryplain&codammaoo=UNURCLE&query=%5B%2F%2F%40physdoc%5D%3D".$this->pre->titulusref->physdoc);
        // }
       
        return $this->subject("Avvenuta accettazione contratto di insegnamento ".$this->pre->user->nameTutorString())     
        ->markdown('emails.firmaemail')->with([
            'pre' => $this->pre,     
            'urlUniContr' => $this->url,      
        ]);    
        
    }
}
