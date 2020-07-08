<?php

namespace App\Http\Controllers\Api\V1;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Insegnamenti;
use App\Models\InsegnamUgov;
use App\User;
use App\Precontrattuale;
use App\Mail\FirstEmail;
use Illuminate\Support\Facades\Mail;
use DB;
use App\Service\EmailService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use App\Exceptions\Handler;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Log;

class InsegnamentiController extends Controller
{
    public function __construct()
    {
        
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {      
        $queryBuilder = Insegnamenti::leftJoin('precontr', function($join) {
            $join->on('precontr.insegn_id', '=', 'p1_insegnamento.id');
        })
        ->leftJoin('users', function($join) {
            $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
        })
        ->orderBy('users.cognome', 'ASC')->orderBy('users.nome', 'ASC');
        $insegn = $queryBuilder->get(['users.id AS userid', 'users.name AS nominativo', 'p1_insegnamento.*']);
        return response()->json([
            'lista' => $insegn,
            'success' => true
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $exist = true;
        $count = 0;        
        $ins = Insegnamenti::where('coper_id', $request->input('coper_id'))->get();
        $count = $ins->count();

        if($count === 0) {            
            $data = [];
            $message = '';
           
                $insegn = new Insegnamenti();
                $postData = $request->except('id', '_method');
                $insegn->fill($postData);
                $success = $insegn->save();
                $data = $insegn;
           
            return compact('data', 'message', 'success');                  
        } else {
            return compact('exist');
        }        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $datiInsegnamento = [];
        $message = '';
        
            $queryBuilder = Insegnamenti::leftJoin('precontr', function($join) {
                $join->on('precontr.insegn_id', '=', 'p1_insegnamento.id');
            })
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('p1_insegnamento.id', $id);
            
            $datiInsegnamento = $queryBuilder->first(['users.id AS userid',
                                                      'users.nome',
                                                      'users.cognome',
                                                      'p1_insegnamento.*',
                                                      'p1_insegnamento.created_at AS createdDate',
                                                      'p2_natura_rapporto.flag_rapp_studio_univ',
                                                      'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                      'p2_natura_rapporto.flag_titolare_pensione',
                                                      'p2_natura_rapporto.natura_rapporto',
                                                      'a1_anagrafica.provincia_residenza',
                                                      'precontr.*']);

            $pre = Precontrattuale::with(['sendemailsrcp'])->where('insegn_id', $id)->first();                                                       
            $datiInsegnamento['sendemailsrcp'] = $pre->sendemailsrcp;

            $pre = Precontrattuale::with(['validazioni'])->where('insegn_id', $id)->first();                                                        
            $datiInsegnamento['validazioni'] = $pre->validazioni;
            $success = true;

            if ($datiInsegnamento['motivo_atto']=='CONF_INC'){
                try{
                    $datiInsegnamento['contatore_insegnamenti'] = Cache::remember('counter_'.$datiInsegnamento['coper_id'], 60, function () use($datiInsegnamento) {
                        return InsegnamUgovController::contatoreInsegnamenti($datiInsegnamento['coper_id']);
                    });
                } catch (\Exception $e) {
                    Log::error($e);                           
                    $handler = new Handler(Container::getInstance());
                    $handler->report($e);
                    $success = false;
                    $message = "Errore lettura contatore insegnamenti";
                }
            }
          
       
        return compact('datiInsegnamento', 'message', 'success');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Precontrattuale::with(['validazioni'])->where('insegn_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        } 


        $datiInsegnamento = [];
        $message = '';
      
            $datiInsegnamento = Insegnamenti::findOrFail($id);
            $success = true;
       
        return compact('datiInsegnamento', 'message', 'success');
    }

    //deprecato per updateInsegnamentoFromUgov
    public function refreshUgovData(Request $request, $coper_id) {
        $datiUgov = [];
        $message = '';        
        $datiUgov = InsegnamUgov::where('COPER_ID', $coper_id)            
            ->first(['coper_id', 'tipo_coper_cod', 'data_ini_contratto', 'data_fine_contratto', 
                    'coper_peso', 'ore', 'compenso', 'motivo_atto_cod', 'tipo_atto_des', 'tipo_emitt_des', 'numero', 'data']);        


            $success = true;        
        return compact('datiUgov', 'message', 'success');
    }

    //deprecato
    public function updateP1(Request $request, $insegn_id)
    {
    
        $data = [];
        $message = '';
       
            $insegn = Insegnamenti::where('id', $insegn_id); 
            $postData = $request->except('id', '_method');
            $success = $insegn->update($postData);
            $data = $insegn;
       
        return compact('data', 'message', 'success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getName($id){
        $datiDocente = [];
        $message = '';
       
            $datiDocente = User::findOrFail($id);
            $success = true;
      
        return compact('datiDocente', 'message', 'success');
    }


    public function query(Request $request){ 
        $parameters = $request->json()->all();        
        $parameters['includes'] = 'precontr';
        $findparam = new \App\FindParameter($parameters);

        $queryBuilder = new QueryBuilder(new Insegnamenti, $request, $findparam);
                
        return $queryBuilder->build()->paginate();            
    }

    public function sendFirstEmail($id){        

        if (!Auth::user()->hasPermissionTo('sending firstemail')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $pre = Precontrattuale::with(['user'])->where('insegn_id',$id)->first();     
        if ($pre->isAnnullata()){
            $data = [];
            $message = trans('global.invio_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }


        if ($pre && $pre->user->email && !Str::contains($pre->user->email,'@uniurb.it')){
            $email = $pre->user->anagraficaugov()->first()->e_mail;                 
            if ($email && Str::contains($email,'@uniurb.it')){
                //aggiornare email utente 
                $pre->user->email = $email;
                $pre->user->save();                
            }else{
                $data = null;
                $message = 'A '.$pre->user->nameTutorString().' non è associata una email istituzionale';
                $success = false;  
                return compact('data', 'message', 'success');
            }            
        }            
        
        $data = EmailService::sendEmailByType($id,"RCP");
        $message = 'Email inviata con successo';
        $success = true;            

        return compact('data', 'message', 'success');
    }
}

