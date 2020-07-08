<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use App\Models\Insegnamenti;
use App\Models\Anagrafica;
use App\Models\B1ConflittoInteressi;
use App\Models\A2ModalitaPagamento;
use App\User;
use App\Models\B4RapportoPA;
use App\Models\B5StatoPensionamento;
use App\Models\P2rapporto;
use App\Models\Validazioni;
use App\Models\B2Incompatibilita;
use App\Models\B3RapportiStudio;
use App\Models\B6Informativa;
use App\Models\C_PrestazioneProfessionale;
use App\Models\D1_Inps;
use App\Models\D2_Inail;
use App\Models\D3_tributari;
use App\Models\D4_fiscali;
use App\Models\D5_fiscali_estero;
use App\Models\D6_detrazioni_familiari;
use App\Models\E_AutonomoOccasionale;
use App\Models\TitulusRef;
use App\Models\StoryProcess;
use Carbon\Carbon;
use Brexis\LaravelWorkflow\Traits\WorkflowTrait;
use Illuminate\Support\Facades\Cache;

class Precontrattuale extends Model {
    
    use WorkflowTrait;
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'precontr';

    protected $fillable = [
        'insegn_id',
        'p2_natura_rapporto_id',
        'a1_anagrafica_id',
        'a2_mod_pagamento_id',
        'b1_confl_interessi_id',
        'b2_incompatibilita_id',
        'b3_rapp_studio_univ_id',
        'b4_rapp_pubbl_amm_id',
        'b5_stato_pensionam_id',
        'b6_trattamento_dati_id',
        'c_prestaz_profess_id',
        'd1_inps_id',
        'd2_inail_id',
        'd3_tributari_id',
        'd4_fiscali_id',
        'd5_fiscali_resid_estero_id',
        'd6_detraz_fam_carico_id',
        'e_autonomo_occasionale_id',
        'docente_id',
        'motivazione',
        'tipo_annullamento'
    ];

    protected $appends = ['currentState'];

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function p2naturarapporto()
    {
        return $this->belongsTo(P2rapporto::class, 'p2_natura_rapporto_id', 'id');
    }

    public function insegnamento()
    {
        return $this->belongsTo(Insegnamenti::class, 'insegn_id', 'id');
    }

    public function personaleRespons()
    {
        return $this->hasOne(PersonaleResponsOrg::class, 'id_ab', 'docente_id');
    }

    public function personale()
    {
        return $this->hasOne(Personale::class, 'id_ab', 'docente_id');
    }

    public function cacheKey()
    {
        return sprintf(
            "%s/%s",
            $this->getTable(),
            $this->docente_id
        );
    }

    public function personaleRelation()
    {
        return Cache::remember($this->cacheKey() . ':personale', 60 * 24 * 20, function () {
            return is_null($this->personale()->get()) ? false : $this->personale()->get();
        });
    }

    // In your example, if A has a b_id column, then A belongsTo B.
    // If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function anagrafica()
    {        
        return $this->belongsTo(Anagrafica::class,'a1_anagrafica_id','id');
    }

    public function user()
    {              
        return $this->belongsTo(User::class,'docente_id','v_ie_ru_personale_id_ab');
    }   

    public function b1conflittointeressi()
    {
        return $this->belongsTo(B1ConflittoInteressi::class,'b1_confl_interessi_id','id');        
    }

    // per compatibilità
    public function conflittointeressi()
    {
        return $this->belongsTo(B1ConflittoInteressi::class,'b1_confl_interessi_id','id');        
    }

    public function b2incompatibilita()
    {
        return $this->belongsTo(B2Incompatibilita::class,'b2_incompatibilita_id','id');        
    }

    public function b3rapportoUniv()
    {
        return $this->belongsTo(B3RapportiStudio::class,'b3_rapp_studio_univ_id','id');        
    }

    public function b4rapportopa()
    {
        return $this->belongsTo(B4RapportoPA::class,'b4_rapp_pubbl_amm_id','id');        
    }
    
    public function b5statopensionamento()
    {
        return $this->belongsTo(B5StatoPensionamento::class,'b5_stato_pensionam_id','id');        
    }

    public function b6informativa()
    {
        return $this->belongsTo(B6Informativa::class,'b6_trattamento_dati_id','id');        
    }

    public function a2modalitapagamento()
    {
        return $this->belongsTo(A2ModalitaPagamento::class,'a2_mod_pagamento_id','id');        
    }

    public function cPrestazioneProfessionale()
    {
        return $this->belongsTo(C_PrestazioneProfessionale::class,'c_prestaz_profess_id','id');   
    }

    public function d1inps()
    {
        return $this->belongsTo(D1_Inps::class,'d1_inps_id','id');        
    }

    public function d2inail()
    {
        return $this->belongsTo(D2_Inail::class,'d2_inail_id','id');        
    }

    public function d3tributari()
    {
        return $this->belongsTo(D3_tributari::class,'d3_tributari_id','id');        
    }

    public function d4fiscali()
    {
        return $this->belongsTo(D4_fiscali::class,'d4_fiscali_id','id');        
    }
    
    public function d5fiscaliestero()
    {
        return $this->belongsTo(D5_fiscali_estero::class,'d5_fiscali_resid_estero_id','id');        
    }  

    public function d6familiari()
    {
        return $this->belongsTo(D6_detrazioni_familiari::class,'d6_detraz_fam_carico_id','id');        
    }

    public function eAutonomoOcasionale()
    {
        return $this->belongsTo(E_AutonomoOccasionale::class,'e_autonomo_occasionale_id','id');        
    }

    public function storyprocesscomp()
    {
        return $this->hasMany(StoryProcess::class, 'insegn_id','insegn_id');
    }

    public function storyprocess()
    {
        return $this->hasMany(StoryProcess::class, 'precontr_id', 'id');
    }


    // In your example, if A has a b_id column, then A belongsTo B.
    // If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function validazioni()
    {
        return $this->hasOne(Validazioni::class,'insegn_id','insegn_id');        
    }

    public function titulusref()
    {
        return $this->hasOne(TitulusRef::class,'insegn_id','insegn_id');        
    }


    /**
     * Get the attachments relation morphed to the current model class
     *
     * @return MorphMany
     */
    public function sendemails()
    {
        return $this->morphMany(SendEmail::class, 'model')->orderby('id', 'DESC');
    }

    public function  sendemailsrcp()
    {
        return $this->morphMany(SendEmail::class, 'model')->where('codifica','RCP');
    }
       
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'model')->AttachmentType();
    }

   /**
     * Set attribute to date format
     * @param $input
     */
    public function setDateAnnullamentoAttribute($input)
    {
        if($input != '') {
            $this->attributes['date_annullamento'] = Carbon::createFromFormat(config('unidem.datetime_format'), $input)->format('Y-m-d H:i:s');
        }else{
            $this->attributes['date_annullamento'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDateAnnullamentoAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }


    public function isAnnullata()
    {        
        return $this->stato == 2 || $this->stato == 3;
    }

    public function isBlocked()
    {        
        if ($this->stato == 1 || $this->isAnnullata()){
            return true;
        }else{
            return $this->validazioni->isBlocked();
        }        
    }



    //per compatibilità query
    public function getDateSubmitAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateUpdAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateAmmAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateMakeAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateAcceptAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function getDateFlagNoCompensoAttribute($input)
    {
       return $this->toLocalTimezone($input);
    }

    public function toLocalTimezone($input){
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d H:i:s', $input)->setTimezone(config('unidem.timezone'))->format(config('unidem.datetime_format'));
        }else{
            return null;
        }
    }

    public function isBozza(){
        return !($this->validazioni->flag_submit && $this->validazioni->flag_upd && $this->validazioni->flag_amm);
    }

    public function getCurrentStateAttribute(){
        if ($this->validazioni){
            if ($this->stato == 2 || $this->stato == 3){
                return "Annullata";
            }
            if ($this->stato == 1){
                return "Contratto firmato dalle controparti";
            }
            if ($this->validazioni->flag_submit && $this->validazioni->flag_upd && $this->validazioni->flag_amm && $this->validazioni->flag_accept){
                return "Contratto visionato e acccettato dal docente";
            }
            if ($this->validazioni->flag_submit && $this->validazioni->flag_upd && $this->validazioni->flag_amm && !$this->validazioni->flag_accept){
                return "Validata Uff. Trattamenti Economici e Previdenziali";
            }
            if ($this->validazioni->flag_submit && $this->validazioni->flag_upd && !$this->validazioni->flag_amm){
                return "Validata Uff. Amm. e Reclutamento Docente";
            }
            if ($this->validazioni->flag_submit && !$this->validazioni->flag_upd){
                return "Compilata";
            }
            if (!$this->validazioni->flag_submit){            
                return "In fase di compilazione . . .";
            }
        }else{
            return '';
        }
    }

    private function checkModelliBase(){
        if ($this->a1_anagrafica_id !== 0 &&
            $this->a2_mod_pagamento_id !== 0 &&
            $this->b1_confl_interessi_id !== 0 &&
            $this->b2_incompatibilita_id !== 0 &&
            $this->checkFlagModelP2()){
                return true;
        }
        return false;
    }

    private function checkFlagModelP2(){
        if ((($this->p2naturarapporto->flag_rapp_studio_univ === 1 && $this->b3_rapp_studio_univ_id !== 0) || $this->p2naturarapporto->flag_rapp_studio_univ === 0 ) &&
        (($this->p2naturarapporto->flag_dipend_pubbl_amm === 1 && $this->b4_rapp_pubbl_amm_id !== 0) || $this->p2naturarapporto->flag_dipend_pubbl_amm === 0 ) &&
        (($this->p2naturarapporto->flag_titolare_pensione === 1 && $this->b5_stato_pensionam_id !== 0) ||$this->p2naturarapporto->flag_titolare_pensione === 0 ) ){
            return true;
        }
        return false;
    }

    public function checkCompilazioneModelli(){
        if ($this->p2naturarapporto->natura_rapporto === 'PRPR') {
            if ($this->p2_natura_rapporto_id !== 0 &&
                $this->checkModelliBase() &&                 
                $this->b6_trattamento_dati_id !== 0 &&
                $this->c_prestaz_profess_id !== 0) {
              return true;
            }
          } else if ($this->p2naturarapporto->natura_rapporto === 'COCOCO') {
            if ($this->p2_natura_rapporto_id !== 0 &&
              $this->checkModelliBase() &&               
              $this->b6_trattamento_dati_id !== 0 &&
              $this->d1_inps_id !== 0 &&
              $this->d2_inail_id !== 0 &&
              $this->d3_tributari_id !== 0 &&
              $this->d4_fiscali_id !== 0 &&
              (($this->anagrafica->provincia_residenza === 'EE' && $this->d5_fiscali_resid_estero_id !== 0) || $this->anagrafica->provincia_residenza !== 'EE') &&
              $this->d6_detraz_fam_carico_id !== 0) {
              return true;
            }
          } else if ($this->p2naturarapporto->natura_rapporto === 'PLAO') {
            if ($this->p2_natura_rapporto_id !== 0 &&
              $this->checkModelliBase() &&               
              $this->b6_trattamento_dati_id !== 0 &&
              $this->e_autonomo_occasionale_id !== 0) {
              return true;
            }
          } else if ($this->p2naturarapporto->natura_rapporto === 'PTG' || $this->p2naturarapporto->natura_rapporto === 'ALD') {
            if ($this->p2_natura_rapporto_id !== 0 &&
              $this->checkModelliBase() &&               
              $this->b6_trattamento_dati_id !== 0) {
              return true;
            }
          } else {
            return false;
          }
    }

}  
      

    