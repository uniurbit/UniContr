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
use App\Models\FirmaIO;
use App\Models\FirmaUSIGN;
use Carbon\Carbon;
use ZeroDaHero\LaravelWorkflow\Traits\WorkflowTrait;
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
        'docente_id', //incerito id_ab dell'anagrafica
        'motivazione',
        'tipo_annullamento',
        'id_sorgente_rinnovo',
        'sorgente_rinnovo_per_id',
        'motivazione_sorgente_rinnovo'
    ];

    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('total', function ($builder) {
            $builder 
            ->join('users as user', 'precontr.docente_id', '=', 'user.v_ie_ru_personale_id_ab')
            ->select([
                'user.nome',
                'user.cognome',
                'precontr.*'
            ]);
        });
    }

    public $appends = ['currentState'];

    //significa le precontrattuali che hanno indicato questo id come sorgente del rinnovo nel campo id_sorgente_rinnovo 
    // id è locale 
    // id_sorgente_rinnovo è nella related
    //se valorizzata indica che questo id è stato usato...
    public function rinnoviSuccessivi()
    {
        return $this->hasMany(Precontrattuale::class, 'id_sorgente_rinnovo', 'id'); //->where('stato','<',2);
    }

    // Define the belongsTo relationship for the renewal source (precedente precontrattuale origine del rinnovo) 
    //cioè la precontrattuale a cui si riferisce id_sorgente_rinnovo 
    public function sorgenteRinnovo()
    {
        return $this->belongsTo(Precontrattuale::class, 'id_sorgente_rinnovo', 'id'); //->where('stato','<',2);
    }

    // Define the recursive relationship
    public function allrinnoviSuccessivi()
    {
        // Initialize an empty collection to hold all children
        $children = collect([]);

        // Iterate through direct children
        foreach ($this->rinnoviSuccessivi as $child) {
            // Add each child to the collection
            $children->push($child);
            // Recursively add all descendants of this child
            $children = $children->merge($child->allrinnoviSuccessivi());
        }

        return $children;
    }

    
    public function getIsNotReferredAttribute()
    {
        $count = $this->rinnoviSuccessivi()->where('stato','<',2)->count() == 0;
        return $count;
    }
    
    // Recursive method to collect all related Precontrattuali via sorgenteRinnovo
    public function allSorgenteRinnovo()
    {
        $records = collect([]);

        // Add the current record to the collection
        $records->push($this);

        // Recursively collect all related records through sorgenteRinnovo
        if ($this->sorgenteRinnovo) {
            $records = $records->merge($this->sorgenteRinnovo->allSorgenteRinnovo());
        }

        return $records;
    }

    public function getMatchingTypes(string $type): array
    {
        $groups = [
            'CONTC' => ['CONTC', 'CONTU'],
            'CONTU' => ['CONTC', 'CONTU'],

            'INTC'  => ['INTC', 'INTU', 'INTXU', 'INTXC'],
            'INTU'  => ['INTC', 'INTU', 'INTXU', 'INTXC'],
            'INTXU' => ['INTC', 'INTU', 'INTXU', 'INTXC'],
            'INTXC' => ['INTC', 'INTU', 'INTXU', 'INTXC'],

            'SUPPU' => ['SUPPU', 'SUPPC'],
            'SUPPC' => ['SUPPU', 'SUPPC'],

            'ALTQG' => ['ALTQG', 'ALTQC', 'ALTQU'],
            'ALTQC' => ['ALTQG', 'ALTQC', 'ALTQU'],
            'ALTQU' => ['ALTQG', 'ALTQC', 'ALTQU'],
        ];

        return $groups[$type] ?? [$type];
    }

    public function isCompleteChain(){
        // Start by assuming the chain is complete
        $isCompleteChain = true;
        $rootPrecontr = $this;

        $motivo_atto = $this->insegnamento->motivo_atto;
        $cod_insegnamento = $this->insegnamento->cod_insegnamento;
        $tipo_contratto =  $this->insegnamento->tipo_contratto; 
        $matchingContractTypes = $this->getMatchingTypes($tipo_contratto);   

        $currentPrecontr = $this;
        //Traverse the chain until we find the root (where id_sorgente_rinnovo is null)
        //condizione motivo_atto è CONF_INC per i rinnovi e BAN_INC o APPR_INC
        //condizione cod_insegnamento uguale a se stesso lungo tutta la catena stessa tipologia contrattuale
        while ($currentPrecontr->id_sorgente_rinnovo !== null) {
            $currentPrecontr = Precontrattuale::withoutGlobalScopes()
                ->whereHas('insegnamento', function ($query) use ($cod_insegnamento, $matchingContractTypes) {
                    // Apply conditions on the 'insegnamento' relationship
                    $query->where('cod_insegnamento', $cod_insegnamento)
                            ->whereIn('tipo_contratto', $matchingContractTypes);
                })
                ->where('id', $currentPrecontr->id_sorgente_rinnovo)                
                ->where('stato','<',2)
                ->first();

            // If we can't find the next precontr in the chain, something is wrong
            if (!$currentPrecontr) {
                $isCompleteChain = false;
                break;
            }
        }

        // Check if the root precontr's motivo_atto is BANC_INC
        if ($isCompleteChain && $currentPrecontr->insegnamento->motivo_atto !== 'BAN_INC' && $currentPrecontr->insegnamento->motivo_atto !== 'APPR_INC') {
            $isCompleteChain = false;
        }

        return $isCompleteChain;
    }
    
    public function countSorgenteRinnovo()
    {
        // // First, check if the chain is complete
        // if (!$this->isCompleteChain()) {
        //     return null; // If the chain is not complete, return null
        // }

        // Chain is complete, count the number of sorgenteRinnovo
        $count = 0;
        $currentPrecontr = $this;

        // Traverse the chain using the belongsTo relationship until we find the root (where sorgenteRinnovo is null)
        while ($currentPrecontr->sorgenteRinnovo) {
            $currentPrecontr = $currentPrecontr->sorgenteRinnovo;
            $count++;
        }

        return $count;
    }

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

    public function firmaIO()
    {
        return $this->hasMany(FirmaIO::class, 'precontr_id', 'id');
    }  
       
    public function firmaUSIGN()
    {
        return $this->hasMany(FirmaUSIGN::class, 'precontr_id', 'id');
    }  

    public function latestFirmaIOnotRejected()
    {        
        return $this->firmaIO()
                    ->whereNotIn('stato', ['REJECTED', 'CANCELLED', 'EXPIRED'])
                    ->orderBy('created_at', 'desc')
                    ->first();

        //return $this->hasOne(FirmaIO::class, 'precontr_id', 'id')->latestOfMany();
    }

    public function latestFirmaUSIGNnotRejected()
    {
        return $this->firmaUSIGN()
                    ->whereNotIn('stato', ['rejected', 'cancelled', 'expired', 'failed'])
                    ->orderBy('created_at', 'desc')
                    ->first();
                    
        //return $this->hasOne(FirmaUSIGN::class, 'precontr_id', 'id')->latestOfMany()->where('stato','!=','rejected');
    }
    
    /**
     * firmaUtente
     * restituisce l'entità di firma corrente U-Sign o FirmaIO
     *
     * @return FirmaUtenteInterface
     */
    public function firmaUtente(){
        return $this->latestFirmaUSIGNnotRejected() ?? $this->latestFirmaIOnotRejected();
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

    public function  isBlockedAmministrativa()
    {        
        if ($this->stato == 1 || $this->isAnnullata()){
            return true;
        }else{
            return $this->validazioni->isBlockedAmministrativa();
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
                return "Contratto visionato e accettato dal docente";
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

    public function checkCompilazioneModelli() { 
        $natura = $this->p2naturarapporto->natura_rapporto;
    
        if ($natura === 'PRPR') {
            if ($this->p2_natura_rapporto_id === 0) return "La pagina P2 natura del rapporto non è compilata";
            if (!$this->checkModelliBase()) return "I modelli base non sono compilati";
            if ($this->b6_trattamento_dati_id === 0) return "La pagina B6 consenso al trattamento dei dati non è compilata";
            if ($this->c_prestaz_profess_id === 0) return "La pagina C prestazioni professionali non è compilata";
            return true;
        } 
    
        if ($natura === 'COCOCO') {
            if ($this->p2_natura_rapporto_id === 0) return "La pagina P2 natura del rapporto non è compilata";
            if (!$this->checkModelliBase()) return "I modelli base non sono compilati";
            if ($this->b6_trattamento_dati_id === 0) return "La pagina B6 consenso al trattamento dei dati non è compilata";
            if ($this->d1_inps_id === 0) return "La pagina D1 dati INPS non è compilata";
            if ($this->d2_inail_id === 0) return "La pagina D2 dati INAIL non è compilata";
            if ($this->d3_tributari_id === 0) return "La pagina D3 dati tributari non è compilata";
            if ($this->d4_fiscali_id === 0) return "La pagina D4 dati fiscali non è compilata";
            if ($this->anagrafica->provincia_fiscale === 'EE' && $this->d5_fiscali_resid_estero_id === 0) return "La pagina D5 dati fiscali per residenza estera non è compilata";
            if (($this->insegnamento->compenso > 3000 && $this->insegnamento->aa >= 2022) && !$this->a2modalitapagamento->soluzione_pagamento) return "La pagina A2 modalità di pagamento non è impostata";
            if ($this->d6_detraz_fam_carico_id === 0) return "La pagina D6 detrazioni per familiari a carico non è compilata";
            return true;
        } 
    
        if ($natura === 'PLAO') {
            if ($this->p2_natura_rapporto_id === 0) return "La pagina P2 natura del rapporto non è compilata";
            if (!$this->checkModelliBase()) return "I modelli base non sono compilati";
            if ($this->b6_trattamento_dati_id === 0) return "La pagina B6 consenso al trattamento dei dati non è compilata";
            if ($this->e_autonomo_occasionale_id === 0) return "La pagina E autonomo occasionale non è compilata";
            return true;
        } 
    
        if ($natura === 'PTG' || $natura === 'ALD') {
            if ($this->p2_natura_rapporto_id === 0) return "La pagina P2 natura del rapporto non è compilata";
            if (!$this->checkModelliBase()) return "I modelli base non sono compilati";
            if ($this->b6_trattamento_dati_id === 0) return "La pagina B6 consenso al trattamento dei dati non è compilata";
            return true;
        }
    
        return "Tipo di rapporto non riconosciuto";
    }
    
    
    public function annoAccademico()
    {        
        return $this->insegnamento->aa.'/'.((int)$this->insegnamento->aa+1);
    }
}  
      

    