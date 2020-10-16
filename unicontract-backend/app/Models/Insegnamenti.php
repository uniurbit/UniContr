<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use App\Precontrattuale;
use Carbon\Carbon;
use App\Models\Validazioni;
use App\Http\Controllers\Api\V1\InsegnamUgovController;
use App\Service\UtilService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Insegnamenti extends Model {
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'p1_insegnamento';

    protected $fillable = [
        'coper_id',
        'ruolo',
        'insegnamento',
        'settore',
        'cod_settore',
        'cfu',
        'ore',
        'cdl',
        'data_ini_contr',
        'data_fine_contr',
        'ciclo',
        'aa',
        'dipartimento',
        'compenso',
        'tipo_contratto',
        'tipo_atto',
        'emittente',
        'motivo_atto',
        'num_delibera',
        'data_delibera',
        'cod_insegnamento',
        'stato',
        'storico',
        'user_role',
        'dip_cod'
    ];

    protected $casts = [
        'data_ini_contr' => 'datetime:d-m-Y',      
        'data_fine_contr' => 'datetime:d-m-Y',        
    ];

    protected $appends = ['createdDate'];
 /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataIniContrAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }

    //per data da ugov
    public function setDataIniContratto($input)
    {
        if($input != '') {
            $this->attributes['data_ini_contr'] = $input->format('Y-m-d');
        }else{
            $this->attributes['data_ini_contr'] = null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataIniContrAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_ini_contr'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_ini_contr'] = null;
        }
    }

     /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataFineContrAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }
  
    //per data da ugov
    public function setDataFineContratto($input)
    {
        if($input != '') {
            $this->attributes['data_fine_contr'] = $input->format('Y-m-d');
        }else{
            $this->attributes['data_fine_contr'] = null;
        }
    }

    /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataFineContrAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_fine_contr'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_fine_contr'] = null;
        }
    }
     
    public function getAnnoContribuzioneAttribute(){
        return Carbon::createFromFormat('Y-m-d', $this->attributes['data_fine_contr'])->year;
    }    

    public function validazioni()
    {
        return $this->belongsTo(Validazioni::class, 'insegn_id', 'id');
    }

    //In your example, if A has a b_id column, then A belongsTo B.
    //If B has an a_id column, then A hasOne or hasMany B depending on how many B should have.
    public function precontr()
    {
        //'precontr.insegn_id', '=', 'p1_insegnamento.id'
        return $this->hasOne(Precontrattuale::class,'insegn_id','id');
    }

    public function setDataFromUgov(InsegnamUgov $insegnamentoUgov){
        
        $this->compenso = $insegnamentoUgov->compenso;
        $this->data_delibera =$insegnamentoUgov->data;
        $this->cfu = $insegnamentoUgov->coper_peso;
        $this->setDataFineContratto($insegnamentoUgov->data_fine_contratto);
        $this->setDataIniContratto($insegnamentoUgov->data_ini_contratto);
        $this->emittente = $insegnamentoUgov->tipo_emitt_des;
        $this->motivo_atto = $insegnamentoUgov->motivo_atto_cod;
        $this->num_delibera = $insegnamentoUgov->numero;
        $this->ore = $insegnamentoUgov->ore;
        $this->tipo_atto = $insegnamentoUgov->tipo_atto_des;
        $this->tipo_contratto = $insegnamentoUgov->tipo_coper_cod;
        $this->ciclo = $insegnamentoUgov->des_tipo_ciclo;
        $this->settore = $insegnamentoUgov->sett_des;
        $this->cod_settore = $insegnamentoUgov->sett_cod;

        // <input type="hidden" name="coper_id" [(ngModel)]="item.coper_id" >
        // <input type="hidden" name="ruolo" [(ngModel)]="item.ruolo_doc_cod">
        // <input type="hidden" name="insegnamento" [(ngModel)]="item.af_gen_des">
        // <input type="hidden" name="settore" [(ngModel)]="item.sett_des">
        // <input type="hidden" name="cod_settore" [(ngModel)]="item.sett_cod">
        // <input type="hidden" name="cfu" [(ngModel)]="item.coper_peso">
        // <input type="hidden" name="ore" [(ngModel)]="item.ore">
        // <input type="hidden" name="cdl" [(ngModel)]="item.nome_cds">
        // <input type="hidden" name="data_ini_contr" [(ngModel)]="item.data_ini_contratto">
        // <input type="hidden" name="data_fine_contr" [(ngModel)]="item.data_fine_contratto">
        // <input type="hidden" name="ciclo" [(ngModel)]="item.des_tipo_ciclo">
        // <input type="hidden" name="aa" [(ngModel)]="item.aa_off_id">
        // <input type="hidden" name="dipartimento" [(ngModel)]="item.dip_des">
        // <input type="hidden" name="compenso" [(ngModel)]="item.compenso">
        // <input type="hidden" name="tipo_contratto" [(ngModel)]="item.tipo_coper_cod">
        // <input type="hidden" name="tipo_atto" [(ngModel)]="item.tipo_atto_des">
        // <input type="hidden" name="emittente" [(ngModel)]="item.tipo_emitt_des">
        // <input type="hidden" name="motivo_atto" [(ngModel)]="item.motivo_atto_cod">
        // <input type="hidden" name="num_delibera" [(ngModel)]="item.numero">
        // <input type="hidden" name="data_delibera" [(ngModel)]="item.data">
        // <input type="hidden" name="cod_insegnamento" [(ngModel)]="item.af_gen_cod">    
        // <input type="hidden" name="dip_cod" [(ngModel)]="item.dip_cod">
    }


    public function deliberaString() {
        
        //$data_delibera = Carbon::createFromFormat(, $this->data_delibera)->format('Y-m-d');
        
        if($this->emittente == "Consiglio di Dipartimento") {
            $tipo_emitt = "Consiglio";
        } else if ($this->tipo_emitt == "Direttore di dipartimento") {
            $tipo_emitt = "Direttore";
        }else{
            $tipo_emitt = $this->emittente;
        }
        
        return "delibera n. ".$this->num_delibera." del ". $this->dataDelibera()." dal ".$tipo_emitt." del ".$this->dipartimento;  
    }

    public function contatore(){    

        return InsegnamUgovController::contatoreInsegnamenti($this->coper_id);

        // $coper_id = $this->coper_id;
        // $value = Cache::get('counter_'.$coper_id, function () use($coper_id) {
        //     return InsegnamUgovController::contatoreInsegnamenti($coper_id);
        // });

        // return $value;
    }

     // RESTITUISCE L'EPIGRAFE DEL RUOLO DOCENTE
    public function ruoloToString($cd_ruolo){        
        if ($cd_ruolo == null){
            $cd_ruolo = $this->ruolo;
        }

        if ($cd_ruolo == 'PO' ||$cd_ruolo == 'ORD') {
            $ruolo = 'Professore Ordinario di I fascia';
        } else if ($cd_ruolo == 'PA' || $cd_ruolo == 'ASS') {
            $ruolo = 'Professore Associato di II fascia';
        } else if ($cd_ruolo == 'RU' || $cd_ruolo == 'RIC') {
            $ruolo = 'Ricercatore Universitario';
        } else if ($cd_ruolo == 'RD') {
            $ruolo = 'Ricercatore Universitario a Tempo Determinato (L. 230/2005)';
        } else if ($cd_ruolo == 'OD') {
            $ruolo = 'Professore Ordinario a Tempo Determinato (L. 230/2005)';
        }else if($cd_ruolo == 'CD') {
            $ruolo = "Collaboratore ed esperto linguistico a tempo determinato";
        } else if ($cd_ruolo == 'CL') {
            $ruolo = "Collaboratore ed esperto linguistico a tempo indeterminato";
        } else if ($cd_ruolo == 'ND') {
            $ruolo = "dipendente Tecnico Amministrativo a tempo indeterminato";
        } else if ($cd_ruolo == 'NM' || $cd_ruolo == 'NE') {
            $ruolo = "dipendente Tecnico Amministrativo a tempo determinato";
        } else if ($cd_ruolo == 'PR') {
            $ruolo = "professionista";
        } else if ($cd_ruolo == 'CC') {
            $ruolo = "collaboratore";
        } else if ($cd_ruolo == 'AU') {
            $ruolo = "lavoratore autonomo";
        } else {
            $ruolo = "dipendente";
        }
        return $ruolo;         
    }

    public function settoreToString(){          
              
        if($this->cod_settore != 'NN') {         
            if (Str::contains($this->cod_settore,';') && Str::contains($this->settore,';')){
                //plurale 
                $cod = explode('; ', $this->cod_settore);
                $sett = explode('; ', mb_strtolower($this->settore, 'UTF-8'));

                $result = array_map(function (...$arrays) {
                    return $arrays[0].' - '.ucfirst($arrays[1]);
                }, $cod, $sett);

                return ' (settori scientifico-disciplinari '.join(', ',$result).')';     
            }
            return ' (settore scientifico-disciplinare '.$this->cod_settore." - ".ucfirst(mb_strtolower($this->settore, 'UTF-8')).')';
        } 
        return  "";
        
    }

    public function cfuToString(){
        if ($this->cfu == 0) {
            return '';
        } else {
            return $this->cfu.' CFU,';
        }
    }

    public function cdlToString(){
        return  ucfirst(mb_strtolower($this->cdl, 'UTF-8'));
    }

    public function dataInizioPeriodo()
    {
        $input = $this->attributes['data_ini_contr'];
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format_contratto'));
        }else{
            return '';
        }
    }

    public function dataFinePeriodo()
    {
        $input = $this->attributes['data_fine_contr'];
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format_contratto'));
        }else{
            return '';
        }
    }

    public function dataDelibera()
    {
        $input = $this->attributes['data_delibera'];
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format_contratto'));
        }else{
            return '';
        }
    }

    public function modalitadiPagamento(){
            
        // VERIFICA SE L'INSEGNAMENTO E' A CAVALLO TRA DUE ANNI
        $delta = substr($this->dataInizioPeriodo(), -4) - substr($this->dataFinePeriodo(), -4);
        
        if($delta != 0) {
            return "due soluzioni, di cui la seconda al termine del contratto";
        } else {
            return "un'unica soluzione al termine del contratto";
        }

    }


    public function periodoToString() {            
        $data_da = $this->dataInizioPeriodo();             
        $data_a = $this->dataFinePeriodo();        
        
        return "dal ".$data_da." al ".$data_a;
    }

    public function emittenteToString() {
        if($this->emittente == "Consiglio di Dipartimento") {
            return "Consiglio";
        } else if ($this->emittente == "Direttore di dipartimento") {
            return "Direttore";
        } else {
            return $this->emittente;
        }
    }

    public function tipoAttoToString(){
        return $this->tipo_atto." n. ".$this->num_delibera." del ".$this->dataDelibera();
    }

    public function getInsegnamentoDescrAttribute()
    {
        return $this->clean_string($this->insegnamento);
    }

    function clean_string($text) {
        $text = str_replace("CONTRATTO INTEGRATIVO -", "", $text);
        $text = str_replace("CONTRATTO INTEGRATIVO DI ", "", $text);
        $text = str_replace("CONTRATTO INTEGRATIVO", "", $text);    
        $text = str_replace("CONTRATTO DI SUPPORTO ALLA DIDATTICA DI ", "", $text);
        $text = str_replace("CONTRATTO DI SUPPORTO ALLA DIDATTICA DEL ", "", $text);
        $text = str_replace("CONTRATTO DI SUPPORTO ALLA DIDATTICA PER ", "", $text);
        $text = str_replace("CONTRATTO DI SUPPORTO ALLA DIDATTICA ", "", $text);
        $text = str_replace("SUPPORTO ALLA DIDATTICA DI ", "", $text);    
        $text = str_replace("SUPPORTO ALLA DIDATTICA - ", "", $text);    
        $text = str_replace("SUPPORTO ALLA DIDATTICA DEL ", "", $text);
        $text = str_replace("SUPPORTO ALLA DIDATTICA PER ", "", $text);
        $text = str_replace("SUPPORTO ALLA DIDATTICA ", "", $text);
        return $text;
    }    


    public function giorniDeliberaAOggi(){
        if ($this->attributes['data_delibera']){
            $datetime1 = Carbon::createFromFormat('Y-m-d', $this->attributes['data_delibera']);
            $datetime2 = Carbon::now();
            $diff_in_days  = $datetime1->diffInDays($datetime2);
            return $diff_in_days;
        }else{
            return '';
        }
 
        //$days = $interval->format('%a');//now do whatever you like with $days
    }

    public function tipoContrattoToString() {
        return UtilService::tipoContratto($this->tipo_contratto);          
    }

    public function tipoConferimentoToString() {
        return UtilService::tipoConferimento($this->motivo_atto);        
    }

    public function getCreatedDateAttribute(){
        if (array_key_exists('createdDate', $this->attributes) && $this->attributes['createdDate']!=null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['createdDate'])->setTimezone(config('unidem.timezone'))->format('Y-m-d H:i:s');
        }
        return null;
    }
}
