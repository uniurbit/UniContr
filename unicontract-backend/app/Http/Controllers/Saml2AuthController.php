<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use Aacotroneo\Saml2\Saml2Auth;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use JWTAuth;
use Illuminate\Support\Facades\Log;
use Aacotroneo\Saml2\Http\Controllers\Saml2Controller;
//Ridefinita l'azione associata alla acs

class Saml2AuthController extends Saml2Controller
{
  
   
    /**
     * Process an incoming saml2 assertion request.
     * Fires 'Saml2LoginEvent' event if a valid user is Found
     */
    public function acs(Saml2Auth $saml2Auth, $idpName)
    {
        $errors = $saml2Auth->acs();

        if (!empty($errors)) {
            logger()->error('Saml2 error_detail', ['error' => $saml2Auth->getLastErrorReason()]);
            session()->flash('saml2_error_detail', [$saml2Auth->getLastErrorReason()]);

            logger()->error('Saml2 error', $errors);
            session()->flash('saml2_error', $errors);
            return redirect(config('saml2_settings.errorRoute'));
        }
        $user = $saml2Auth->getSaml2User();

        event(new Saml2LoginEvent($idpName, $user, $saml2Auth));

        $luser = Auth::user();        
                
        //check blocked user
        if (date(config('unidem.date_format')) <= auth()->user()->blocked_date) {  
            abort(403, trans('global.utente_non_autorizzato'));          
        }        

        $redirectUrl = $luser->getIntendedUrl();
        //dall'idp        
        $redirectUrlFromLogin = $user->getIntendedUrl();

        //i custom claim sono definiti nell'utente
        $token = JWTAuth::fromUser( $luser);

        Log::info('redirectUrl [' . $redirectUrl . ']');       
        Log::info('token [' . $token . ']');       
        
        if ($redirectUrl !== null) {
            return redirect($redirectUrl.'?token='.$token.($redirectUrlFromLogin ? ('&redirect='.$redirectUrlFromLogin) : '') )             
                ->header('token', $token)
                ->header('token_type', 'bearer')
                ->header('expires_in', Auth::guard()->factory()->getTTL() * 60);
            
        } else {

            return redirect(config('saml2_settings.loginRoute'));
        }
    }

}
