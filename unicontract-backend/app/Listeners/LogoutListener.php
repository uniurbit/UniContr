<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Auth;
use \Aacotroneo\Saml2\Events\Saml2LogoutEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class LogoutListener
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
    public function handle(Saml2LogoutEvent $event)
    {
        Log::info('SSO Logout event listener');
        Auth::logout();
        Session::save();
    }
}
