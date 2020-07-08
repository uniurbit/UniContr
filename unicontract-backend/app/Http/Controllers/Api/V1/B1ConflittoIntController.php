<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Docente;
use App\Precontrattuale;
use App\Models\B1ConflittoInteressi;
use PDF;
use App\Attachment;
use App\Repositories\B1ConflittoInteressiRepository;
use App\Service\PrecontrattualeService;
use Auth;

class B1ConflittoIntController extends Controller
{
    
    //B1ConflittoInteressiRepository

    /**
     * @var B1ConflittoInteressiRepository
     */
    private $repo;
    public function __construct(B1ConflittoInteressiRepository $repo){
        $this->repo = $repo;
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $datiPrecontrattuale = [];
        $message = '';
    
            $datiPrecontrattuale = PrecontrattualeService::getDatiIntestazione($id);

            //cercare l'ultima precontrattuale inserita stato = 0 o stato = 1 docente_id
            $copy = B1ConflittoInteressi::with(['cariche','incarichi'])->whereHas('precontrattuale', function ($query) use($datiPrecontrattuale) {
                $query->where('docente_id',$datiPrecontrattuale['docente_id'])->where('stato','<',2);
            })->orderBy('id','desc')->first();

            $datiPrecontrattuale['copy'] = $copy;                

            $success = true;
     
        return compact('datiPrecontrattuale', 'message', 'success');
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
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        $datiConflitto = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiConflitto = $this->repo->store($postData);      
        return compact('datiConflitto', 'message', 'success');        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiConflitto = [];
        $message = '';
       
            $datiConflitto = B1ConflittoInteressi::leftJoin('precontr', function($join) {
                $join->on('precontr.b1_confl_interessi_id', '=', 'b1_confl_interessi.id');
            })
            ->leftJoin('p2_natura_rapporto', function($join) {
                $join->on('p2_natura_rapporto.id', '=', 'precontr.p2_natura_rapporto_id');
            })
            ->leftJoin('p1_insegnamento', function($join) {
                $join->on('p1_insegnamento.id', '=', 'precontr.insegn_id');
            })
            ->leftJoin('a1_anagrafica', function($join) {
                $join->on('a1_anagrafica.id', '=', 'precontr.a1_anagrafica_id');
            })
            ->leftJoin('users', function($join) {
                $join->on('users.v_ie_ru_personale_id_ab', '=', 'precontr.docente_id');
            })
            ->where('b1_confl_interessi.id', $id)->first(['users.nome',
                                                          'users.cognome',
                                                          'a1_anagrafica.provincia_residenza',
                                                          'b1_confl_interessi.*',
                                                          'b1_confl_interessi.created_at AS createdDate',
                                                          'precontr.*',
                                                          'p2_natura_rapporto.natura_rapporto',
                                                          'p2_natura_rapporto.flag_rapp_studio_univ',
                                                          'p2_natura_rapporto.flag_dipend_pubbl_amm',
                                                          'p2_natura_rapporto.flag_titolare_pensione',
                                                          'p1_insegnamento.insegnamento',
                                                          'p1_insegnamento.aa']);

            $b1rel = B1ConflittoInteressi::with(['cariche','incarichi'])->where('id',$id)->first();

            $datiConflitto['cariche'] = $b1rel->cariche;
            $datiConflitto['incarichi'] = $b1rel->incarichi;

            $pre = Precontrattuale::with(['validazioni'])->where('b1_confl_interessi_id', $id)->first();                                                        
            $datiConflitto['validazioni'] = $pre->validazioni;

            $success = true;
        
        return compact('datiConflitto', 'message', 'success');
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
        if (!Auth::user()->hasPermissionTo('compila precontrattuale')) {
            abort(403, trans('global.utente_non_autorizzato'));
        }        

        if (Precontrattuale::with(['validazioni'])->where('b1_confl_interessi_id', $id)->first()->isBlocked()){
            $data = [];
            $message = trans('global.aggiornamento_non_consentito');
            $success = false;
            return compact('data', 'message', 'success');   
        }        

        $datiConflitto = [];
        $message = '';
        $success = true;                
        $postData = $request->except('id', '_method');             
        $datiConflitto = $this->repo->updateConflitto($postData, $id);      
        return compact('datiConflitto', 'message', 'success');        
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

     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($id,$kind)
    {
        $conflitto = B1ConflittoInteressi::findOrFail($id);   

        $pre = Precontrattuale::with(['anagrafica','user','validazioni','insegnamento','conflittointeressi.cariche','conflittointeressi.incarichi'])
            ->where('b1_confl_interessi_id',$id)->first();   

        $attach = null;

        if ($kind=='CONFL_INT_TRASP'){
            $pdf = PDF::loadView('pdfConflittoInteressiTrasparenza', ['pre' => $pre])
                ->setOption('margin-left','20')
                ->setOption('margin-right','20')
                ->setOption('margin-top','30')
                ->setOption('margin-bottom','20');
                 
            $attach['filename'] = 'Dichiarazione Trasparenza '. $pre->user->nameTutorString() .'.pdf';
        }else{ //CONFL_INT
            $pdf = PDF::loadView('pdfConflittoInteressi', ['pre' => $pre])
                ->setOption('margin-left','20')
                ->setOption('margin-right','20')
                ->setOption('margin-top','30')
                ->setOption('margin-bottom','20');   
                
            $attach['filename'] = 'Dichiarazione '. $pre->user->nameTutorString() .'.pdf';
        }                          
        $attach['filevalue'] =  base64_encode($pdf->download());

        return $attach;
    }
}
