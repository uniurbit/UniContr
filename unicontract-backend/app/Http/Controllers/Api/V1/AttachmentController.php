<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Attachment;
use App\Http\Controllers\Controller;
use Validator;
use App\Convenzione;
use Storage;
use App\Http\Controllers\SoapControllerTitulus;
use Artisaninweb\SoapWrapper\SoapWrapper;
use App\Service\TitulusHelper;
use Auth;
class AttachmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Attachment::all();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Attachment::find($id);
    }

  
    public function query(Request $request){       

        $queryBuilder = new QueryBuilder(new Dipartimeno, $request);
                
        return $queryBuilder->build()->paginate();       

    }

    public function uploadFile(Request $request){
        
        if (!Auth::user()->hasPermissionTo('create attachments')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }

        $rules = array();

        $validator = Validator::make($request->all(), $rules);
        if ($validator-> fails()){
            return $this->respondValidationError('Validazione fallita.', $validator->errors());
        }

        $attachment = $this->saveAttachment($request->all());       
        if ($attachment){
            //file caricato con successo
            //ritornare id del file 
            $attachment->attachmenttype()->get();       
            return $attachment;
        }                
        return response()->json('Il documento '.$request->get('filename').' non è stato memorizzato', 404);
    }

    public function saveAttachment($data){              
        $attachment = new Attachment($data);              
        if (array_key_exists('filevalue',$data) && $attachment->loadStream($data['filevalue']) != null ){                
            $attachment->save();
        }else{                            
            if ($attachment->nrecord && $attachment->num_prot && $attachment->createLink($attachment->num_prot)){
                $attachment->save();
            } else{
                throw new Exception("Error file ".$data['filename']." not saved", 1);                
            }
        }   
        return $attachment;          
    }


    public function deletefile($id){
        if (!Auth::user()->hasPermissionTo('delete attachments')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }

        Attachment::find($id)->delete();
        return response()->json(null, 204);
    }

    public function download($id){

        if (!Auth::user()->hasPermissionTo('view attachments')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $attach = Attachment::find($id);
        if ($attach->nrecord){
            $app = TitulusHelper::downloadAttachment($attach->nrecord);
            if ($app){
                $attach['filevalue'] =  base64_encode($app->content);                                                    
                if ($attach->filetype == 'link'){
                    $attach['filename'] = $app->title.'.pdf';
                }
            }
        }else{
            if ($attach['type'] != 'empty' && $attach['filepath']){                        
                $attach['filevalue'] = base64_encode(Storage::get($attach->filepath));
            }
        }        
        return $attach;        
    }

    public function getTitulusDocumentURL($id){

        if (!Auth::user()->hasPermissionTo('view attachments')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }   

        $attach = Attachment::find($id);        
        if ($attach->nrecord){
            $sc = new SoapControllerTitulus(new SoapWrapper);

            $resp = $sc->getDocumentURL($attach->nrecord);
            $parse = parse_url($resp);        
            return [
                'url'=> config('titulus.url').$parse['path'].'?'.$parse['query']
            ];
        }        

        return response()->json(null);
    }
}
