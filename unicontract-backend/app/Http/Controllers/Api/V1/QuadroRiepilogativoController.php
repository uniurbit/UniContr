<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Precontrattuale;
use App\Models\Ugov\ContrUgov;
use App\Models\Ugov\RelazioniDgUgov;
use App\Precontrattuale as Pre;
use App\User;
use Auth;
use App\Service\EmailService;
use Illuminate\Support\Str;

class QuadroRiepilogativoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $datiGenerali = [];
        $message = '';

            $queryBuilder = Precontrattuale::withoutGlobalScopes()->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('table_validation', function($join) {
                $join->on('table_validation.insegn_id', '=', 'precontr.insegn_id');
            })
            ->where('precontr.insegn_id', $id);
            $datiGenerali = $queryBuilder->first(
                ['users.id AS userid',
                 'users.nome',
                 'users.cognome',
                 'precontr.*',
                 'p1_insegnamento.insegnamento',
                 'p1_insegnamento.aa',
                 'p1_insegnamento.data_ini_contr',
                 'p1_insegnamento.data_fine_contr',
                 'p1_insegnamento.motivo_atto',
                 'p1_insegnamento.ciclo',
                 'p1_insegnamento.coper_id',
                 'p2_natura_rapporto.natura_rapporto',
                 'a1_anagrafica.sesso',
                 'table_validation.*'
                 ]);
 

            $pre = Pre::with(['attachments','user.attachments','anagrafica.audit','a2modalitapagamento.audit'])->where('insegn_id', $id)->first();            
            $datiGenerali['attachments'] = $pre->attachments ?: [];                        
            $datiGenerali['userattachments'] = $pre->user ? $pre->user->attachments ?: [] : [];            
            if ($pre->a2modalitapagamento){
                    $datiGenerali['a2modalitapagamentoaudit'] = $pre->a2modalitapagamento->audit()->whereIn('id',
                    $pre->a2modalitapagamento->audit()->selectRaw('max(`id`)')->groupBy('field_name')->get()
                )->get();                                 
            }else{
                $datiGenerali['a2modalitapagamentoaudit']= [];
            }
            
            if ($pre->anagrafica){
                $datiGenerali['anangraficaaudit'] = $pre->anagrafica->audit()->whereIn('id',
                    $pre->anagrafica->audit()->selectRaw('max(`id`)')->groupBy('field_name')->get()
                )->get();                                 
            }else{
                $datiGenerali['anangraficaaudit']= [];
            }
            $datiGenerali['richiesta'] = $pre->sendemails()->with(['user'])->where('codifica','INFO')->orderBy('id','desc')->first();
            
            $success = true;
      
        return compact('datiGenerali', 'message', 'success');
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
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

    public function sendInfoEmail(Request $request){        

        if (!Auth::user()->hasPermissionTo('sending infoemail')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $pre = Pre::with(['user'])->where('insegn_id',$request->insegn_id)->first();     
       
        if ($pre && $pre->user->email && !Str::contains(strtolower($pre->user->email),'@uniurb.it')){
            $email = $pre->user->anagraficaugov()->first()->e_mail;                 
            if ($email && Str::contains(strtolower($email),'@uniurb.it')){
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
        
        $data = EmailService::sendEmailInfo($request->insegn_id, $request->entity);
        $data->load('user');
        $data->model = null;
        $message = 'Email inviata con successo';
        $success = true;            

        return compact('data', 'message', 'success');
    }

    public function getIddg($coper_id) {
        $datiCont = [];
        $message = '';
       
            // $datiCont = ContrUgov::leftJoin('V_IE_DG02_R_DG', function($join) {
            //     $join->on('V_IE_DG02_R_DG.ID_DG_1', '=', 'V_IE_DG11_X_CONTR.ID_DG');
            // })
            // ->where('ID_SIADI', $coper_id)->first(['V_IE_DG11_X_CONTR.ID_DG', 'V_IE_DG02_R_DG.ID_DG_2']);

            //$rel = ContrUgov::with(['relazioni'])->where('ID_SIADI', $coper_id)->first();
            // $datiCont['relazioni'] = $rel->relazioni;

            $datiCont = ContrUgov::with(['compensi','rate','compensi.ordinativi'])->where('id_siadi', $coper_id)->first(['id_x_contr','id_dg','id_siadi','num_rate','fl_gratuito','costo_totale']);

            $success = true;
       
        return compact('datiCont', 'message', 'success');
    }
}
