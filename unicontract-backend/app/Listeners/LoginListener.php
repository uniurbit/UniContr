<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use App\User;
use App\Ruolo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\MessageBag;
use App\Service\LoginService;
use Exception;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Illuminate\Support\Str;
class LoginListener
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
    public function handle(Saml2LoginEvent $event)
    {
        $messageId = $event->getSaml2Auth()->getLastMessageId();
        Log::info('messageId [' . $messageId . ']');   

        $attributesName = [
            'eduPersonEntitlement' => 'urn:oid:1.3.6.1.4.1.5923.1.1.1.7',
            'cn' => 'urn:oid:2.5.4.3',                            
            'displayName' => 'urn:oid:2.16.840.1.113730.3.1.241',
            'codiceFiscale' => 'urn:oid:1.3.6.1.4.1.4203.666.11.11.1.0',
            'eduPersonOrgDN' => 'urn:oid:1.3.6.1.4.1.5923.1.1.1.3',
            'pid' => 'urn:oid:2.5.4.10',
            'uid' => 'urn:oid:0.9.2342.19200300.100.1.1',
            'eduPersonScopedAffiliation' => 'urn:oid:1.3.6.1.4.1.5923.1.1.1.9',
            'surname' => 'urn:oid:2.5.4.4',
            'schacHomeOrganization' => 'urn:oid:1.3.6.1.4.1.25178.1.2.9',
            'eduPersonPrincipalName' => 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6',
            'realm' => 'urn:oid:2.5.4.100',
            'eduPersonUniqueId' => 'urn:oid:1.3.6.1.4.1.5923.1.1.1.13',
            'email' => 'urn:oid:0.9.2342.19200300.100.1.3',
            'matricola' => 'urn:oid:1.3.6.1.4.1.27280.1.20',    
            'ruolo' => 'urn:oid:1.3.6.1.4.1.27280.1.13'        
        ];

        $user = $event->getSaml2User();
        Log::info('user [' . $user->getUserId() . ']');   
        $user->parseAttributes($attributesName);
        
        $userData = new \App\User;    
        
        $userData->id = $user->getUserId();
        $userData->attributes = $user->getAttributes();
        $userData->name = $user->displayName[0];
        $userData->email = $user->email[0];
        $userData->ruolo = $user->ruolo[0];
        Log::info('email [' . $userData->email . ']');   
        Log::info('ruolo [' . $userData->ruolo . ']');   
        $userData->eduPersonScopedAffiliation = $user->eduPersonScopedAffiliation;
        $userData->password =Hash::make($user->codiceFiscale[0]);
        $userData->assertion = $user->getRawSamlAssertion();
        $userData->cf = $user->codiceFiscale[0];

        //check if email already exists and fetch user
        $laravelUser = \App\User::where('email', $userData['email'])->first();
        Log::info('laravel user [' . $laravelUser . ']');                     
        //ulteriore verifica attraverso il codice fiscale 
        if ($laravelUser===null){
            $laravelUser = \App\User::where('cf', $userData['cf'])->first();
            if ($laravelUser !== null ){
                //aggiornare email 
                if (Str::contains($userData['email'],'@uniurb.it')){   
                    $laravelUser->email = $userData['email'];
                    $laravelUser->save();  
                    Log::info('Aggiornata email laravel user [' . $laravelUser->name . ']'); 
                } 
            }
        }
                        
        try{
            //if email doesn't exist, create new user
            if($laravelUser === null)
            {		
                Log::info('inserisci utente [' . $userData->name . ' '. $userData->email . ' '.$user->codiceFiscale[0].' ]');                
                $laravelUser = new \App\User;                             
                $laravelUser->name = $userData['name'];
                $laravelUser->email = $userData['email'];
                $laravelUser->password = Hash::make($user->codiceFiscale[0]);          
                //Per ulteriore controllo memorizza anche il codice fiscale       
                $laravelUser->cf = $user->codiceFiscale[0];

                Log::info('istanza utente [' . $laravelUser->name . ' '. $laravelUser->email . ' ]');        
                //va determinato il ruolo da assegnare 1) leggerlo da file id configurazione, 2) ruolo di default
                $service = new LoginService();
                Log::info('istanza service');        
                $data = null;
                if ($userData['ruolo'] && Ruolo::isRuoloDocente($userData['ruolo'])){
                    $data = $service->findDocenteData($userData->email);
                }else{
                    $data = $service->findUserRoleAndData($userData->email);
                }

                Log::info('ruoli [' . implode(';',$data['ruoli']) . ']');     

                if ($data){            
                    $laravelUser->v_ie_ru_personale_id_ab = $data['id_ab'];
                    $laravelUser->save();                       
                    $laravelUser->assignRole($data['ruoli']);                                  
                }
            
            }
                 
        } catch (\Exception $e) {
            Log::info('Errore nuovo utente non creato');                            
            $handler = new Handler(Container::getInstance());
            $handler->report($e);

            Log::info('Utente non autorizzato: '.$userData->email.' '.$userData->ruolo);
            abort(401,  trans('global.utente_non_autorizzato'));
        }

        // Here we save the received nameId and sessionIndex needed later for the LogoutRequest
        session()->put('nameId', $user->getNameId());
        session()->put('sessionIndex', $user->getSessionIndex());
        
        Log::info('login [' . $laravelUser->name . ']');  
        Auth::login($laravelUser);
    }   
}
