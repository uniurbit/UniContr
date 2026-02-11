<?php

namespace App\Http\Controllers\Api\V1;
 
use App\Http\Controllers\Controller;
use App\Message;
use App\User;
use App\Notifications\NotificaDocente;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
 
class NotificationController extends Controller
{
  
 
    public function sendMail(Request $request)
    {
        $this->validate($request, [            
            'name'=>'required',
            'email'=>'required|email',            
        ]);

        $message = '';
        $success = true;
              
            Notification::route('mail', $request->email)->notify(new NotificaDocente($request->all()));          
            $success = true;
      
        return compact('message', 'success');  
      
    }
}
