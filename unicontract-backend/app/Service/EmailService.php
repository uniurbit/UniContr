<?php

namespace App\Service;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Insegnamenti;
use App\InsegnamUgov;
use App\User;
use App\Precontrattuale;
use App\PrecontrattualePerGenerazione;
use App\SendEmail;
use App\Mail\FirstEmail;
use App\Mail\SubmitEmail;
use App\Mail\ValidateEmail;
use App\Mail\FirmaEmail;
use App\Mail\ContrattoEmail;
use App\Mail\InfoEmail;
use Illuminate\Support\Facades\Mail;
use DB;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class EmailService implements ApplicationService
{
    public static function sendToDocente($email, $pre, $tolocal = null){
   
        if (App::environment(['local','preprod'])) {
            //sviluppo debug
            if (Auth::user()){
                Mail::to(Auth::user())->send($email);            
            }else{
                //nel caso di comandi schedulati 
                Mail::to(config('unidem.administrator_email'))->send($email);                    
            }                                    
        } else {
            if ($pre->anagrafica){
                Mail::to($pre->user)
                    ->cc($pre->anagrafica->email_privata ?: [])
                    ->bcc(config('unidem.administrator_email'))->send($email);                
            }else{
                //leggo email privata da ugov (non esiste ancora l'anagrafica locale)
                $anagrafica = $pre->user->anagraficaugov()->first();
                Mail::to($pre->user)
                    ->cc($anagrafica->e_mail_privata ?: [])
                    ->bcc(config('unidem.administrator_email'))->send($email);
            }
            
        }          

    }

    //funzione chiamata con comando schedulato
    public static function sendEmailContratto($insegn_id, $document, $documentName){
                
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','titulusref'])->where('insegn_id',$insegn_id)->first();         
        if ($pre && $pre->user->email &&  Str::contains(strtolower($pre->user->email),'@uniurb.it')){         

            $email = new ContrattoEmail($pre,$document,$documentName);        
            
            if (App::environment(['local','preprod'])) {
                Mail::to(config('unidem.administrator_email'))->send($email);                           
            } else {
                Mail::to($pre->user)        
                    ->cc($pre->anagrafica->email_privata ?: [])           
                    ->bcc(config('unidem.administrator_email'))
                    ->send($email);
            }          

            $sendEmail = new SendEmail();
            $sendEmail->sender_user_id = $pre->user->id;
            $sendEmail->receiver_docente_id = $pre->user->v_ie_ru_personale_id_ab;
            $sendEmail->codifica = "SEND_CONTR";
            $sendEmail->oggetto = $email->subject;
            $sendEmail->model()->associate($pre->getPrecontrattualeType());
            
            $sendEmail->save();

        }else{        
            throw new Exception('A '.$pre->user->nameTutorString().' non è associata una email istituzionale');
        }
    }


    public static function sendEmailAPP_Firma($pre){
               
        $email = new FirmaEmail($pre);        
        
        if (App::environment(['local','preprod'])) {
            Mail::to(Auth::user())->send($email);
        } else {            
            Mail::to(config('unidem.firma_direttore_email'))
                ->bcc(config('unidem.administrator_email'))->send($email);
        }          

        $sendEmail = new SendEmail();
        $sendEmail->sender_user_id = Auth::user()->id;
        $sendEmail->receiver = 'UFFICI';
        $sendEmail->codifica = "APP_FIRMA";
        $sendEmail->oggetto = $email->subject;
        $sendEmail->model()->associate($pre->getPrecontrattualeType());
        
        $sendEmail->save();        
    }

    public static function sendEmailAPP_Validazione($pre){
        
        if ($pre && $pre->user->email &&  Str::contains(strtolower($pre->user->email),'@uniurb.it')){         

            $email = new ValidateEmail($pre);        
            
            EmailService::sendToDocente($email,$pre);

            $sendEmail = new SendEmail();
            $sendEmail->sender_user_id = Auth::user()->id;
            $sendEmail->receiver_docente_id = $pre->user->v_ie_ru_personale_id_ab;
            $sendEmail->codifica = "APP";
            $sendEmail->oggetto = $email->subject;
            $sendEmail->model()->associate($pre->getPrecontrattualeType());
            
            $sendEmail->save();

        }else{
            throw new Exception('Al '.$pre->user->nameTutorString().' non è associata una email istituzionale');
        }
    }

    public static function sendEmailRCP($pre){
        if ($pre && $pre->user->email &&  Str::contains(strtolower($pre->user->email),'@uniurb.it')){   

            $email = new FirstEmail($pre);
            
            EmailService::sendToDocente($email,$pre);
                                
            $sendEmail = new SendEmail();
            $sendEmail->sender_user_id = Auth::user()->id;
            $sendEmail->receiver_docente_id = $pre->user->v_ie_ru_personale_id_ab;
            $sendEmail->codifica = "RCP";
            $sendEmail->oggetto = $email->subject;
            $sendEmail->model()->associate($pre->getPrecontrattualeType());
            
            $sendEmail->save();

            return $sendEmail;
            
        }else{
            throw new Exception('Al '.$pre->user->nameTutorString().' non è associata una email istituzionale');
        }
    }

    public static function sendEmailCMU($pre){                
        $email = new SubmitEmail($pre);
        //uni_users.email        
        if (App::environment(['local','preprod'])) {
            Mail::to(Auth::user())->send($email);
        } else {            
            //['unicontract@uniurb.it','amministrazione.reclutamento.pdoc@uniurb.it']
            Mail::to(config('unidem.cmu_email'))
                ->bcc(config('unidem.administrator_email'))->send($email);
        }        
        
        $sendEmail = new SendEmail();
        $sendEmail->sender_user_id = Auth::user()->id;
        $sendEmail->receiver = 'UFFICI';
        $sendEmail->codifica = "CMU";
        $sendEmail->oggetto = $email->subject;
        $sendEmail->model()->associate($pre->getPrecontrattualeType());
        
        $sendEmail->save();

    }

    public static function sendEmailInfo($insegn_id, $entity){
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento'])->where('insegn_id',$insegn_id)->first();   
        if ($pre && $pre->user->email &&  Str::contains(strtolower($pre->user->email),'@uniurb.it')){   

            $email = new InfoEmail($pre, $entity);
            
            EmailService::sendToDocente($email,$pre);
                                
            $sendEmail = new SendEmail();
            $sendEmail->sender_user_id = Auth::user()->id;
            $sendEmail->receiver_docente_id = $pre->user->v_ie_ru_personale_id_ab;
            $sendEmail->codifica = "INFO";
            $sendEmail->oggetto = $email->subject;
            $sendEmail->corpo_testo = $entity['corpo_testo'];
            $sendEmail->group_id = Auth::user()->roles->first()->name;
            $sendEmail->model()->associate($pre->getPrecontrattualeType());
            
            $sendEmail->save();

            return $sendEmail;
            
        } else {
            throw new Exception('Al '.$pre->user->nameTutorString().' non è associata una email istituzionale');
        }
    }

    public static function sendEmailByType($insegn_id,$kind){
        $pre = PrecontrattualePerGenerazione::with(['anagrafica','user','insegnamento','titulusref'])->where('insegn_id',$insegn_id)->first();   
        if ($kind=="RCP"){
            return EmailService::sendEmailRCP($pre);
        } elseif ($kind=="CMU"){
            return EmailService::sendEmailCMU($pre);         
        } elseif ($kind=="APP"){
            return EmailService::sendEmailAPP_Validazione($pre);
        } elseif ($kind=="APP_FIRMA"){
            return EmailService::sendEmailAPP_Firma($pre);
        } 
    }

    


}
