<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Attachment;
use App\Precontrattuale;
use App\Audit;
use Illuminate\Support\Arr;

class Anagrafica extends Model
{
    protected $table = 'a1_anagrafica';
    protected $fillable = [
        'sesso',
        'nazione_nascita',
        'comune_nascita',
        'provincia_nascita',
        'data_nascita',
        'cf_coniuge',
        'stato_civile',
        'titolo_studio',
        'nazione_residenza',
        'comune_residenza',
        'provincia_residenza',
        'cap_residenza',
        'indirizzo_residenza',
        'civico_residenza',
        'data_variazione_residenza',
        'comune_fiscale',
        'provincia_fiscale',
        'cap_fiscale',
        'indirizzo_fiscale',
        'civico_fiscale',
        'data_variazione_dom_fiscale',
        'comune_comunicazioni',
        'provincia_comunicazioni',
        'cap_comunicazioni',
        'indirizzo_comunicazioni',
        'civico_comunicazioni',
        'telefono_abitazione',
        'telefono_cellulare',
        'telefono_ufficio',
        'fax',
        'email',
        'email_privata',
        'flag_lavoratrici_madri'
    ];

    protected $appends = ['createdDate'];

    public function precontrattuale()
    {        
        return $this->hasOne(Precontrattuale::class,'a1_anagrafica_id','id');
    }


    public function audit()
    {
        return $this->morphMany(Audit::class, 'model');
    }

      /**
     * Set attribute to date format
     * @param $input
     */
    public function setDataNascitaAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_nascita'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_nascita'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getDataNascitaAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    public function setDataVariazioneDomFiscaleAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_variazione_dom_fiscale'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_variazione_dom_fiscale'] = null;
        }
    }

    public function getDataVariazioneDomFiscaleAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    public function setDataVariazioneResidenzaAttribute($input)
    {
        if($input != '') {
            $this->attributes['data_variazione_residenza'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['data_variazione_residenza'] = null;
        }
    }

    public function getDataVariazioneResidenzaAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }

    public function getDataNascitaContrAttribute()
    {
        $input = $this->attributes['data_nascita'];
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format_contratto'));
        }else{
            return null;
        }
    }


    public function getCreatedDateAttribute(){
        if (array_key_exists('createdDate', $this->attributes) && $this->attributes['createdDate']!=null){
            return Carbon::createFromFormat('Y-m-d H:i:s', $this->attributes['createdDate'])->setTimezone(config('unidem.timezone'))->format('Y-m-d H:i:s');
        }
        return null;
    }

  
    //senza CF
    public function datiAnagraficaString(){
        if($this->sesso == 'M' ) {
            return "nato a ".ucwords(strtolower($this->comune_nascita))." (".$this->provincia_nascita."), il ".$this->dataNascitaContr; 
        } else {
            return "nata a ".ucwords(strtolower($this->comune_nascita))." (".$this->provincia_nascita."), il ".$this->dataNascitaContr; 
        }
    }

    public function datiAnagraficaTrasparenzaString() {
        if($this->sesso == 'M' ) {
            return "nato a ###### (##), il ##/##/####"; 
        } else {
            return "nata a ###### (##), il ##/##/####"; 
        }
    }

    public function datiResidenza(){
        if($this->sesso == 'M') {
            $str1 = "il Docente";
            $str2 = "o";
        } else {
            $str1 = "la Docente";
            $str2 = "a";
        }
          
        return "residente a ".$this->comune_residenza." (".$this->provincia_residenza.") - ".$this->cap_residenza." in ".$this->indirizzo_residenza.
                ($this->civico_residenza ? " n. ".$this->civico_residenza : '').", d'ora in poi denominat".$str2." ".$str1.",";
    }

    public function datiResidenzaReport(){
        return $this->comune_residenza." (".$this->provincia_residenza."), ".$this->cap_residenza." - ".$this->indirizzo_residenza.
            ($this->civico_residenza ? " n. ".$this->civico_residenza : '');
    }

    public function datiDomicilioFiscaleReport(){
        if ($this->comune_fiscale && $this->provincia_fiscale && $this->indirizzo_fiscale) {  
            return $this->comune_fiscale." (".$this->provincia_fiscale."), ".$this->cap_fiscale." - ".$this->indirizzo_fiscale.
                ($this->civico_fiscale ? " n. ".$this->civico_fiscale : '');
        }
        return null;
    }

    public function genereSelection(){
        if($this->sesso == 'M') {
            return [
                'str0' => "Il",
                'str1' => "il",
                'str2' => "o",
                'str3' => "dal",
                'str4' => "al",
                'str5' => "Docente"
            ];
        }else{
            return [
                'str0' => "La",
                'str1' => "la",
                'str2' => "a",
                'str3' => "dalla",
                'str4' => "alla",
                'str5' => "Docente"
            ];
        }
    }
  
    public function statoCivileToString(){
        $st = $this->stato_civile;
        $filtered = Arr::first(Anagrafica::statoCivileLista($this->sesso), function ($value, $key) use($st){
            return $value['key'] == $st;
        });
        return $filtered ? $filtered['value'] : null;
    }

    public static function genderTranslate($sex){
        if ($sex){
          return $sex === 'M' ? 'o' : 'a';
        }
        return 'o';    
    }
    
    public static function statoCivileLista($sex){
        return [
            [ 'key'=> 'C', 'value' => __('global.C_coniugato',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> 'D', 'value'=> __('global.D_divorziato',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> 'L', 'value'=> __('global.L_libero',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> 'N', 'value'=> trans_choice('global.N_celibe', $sex === 'F' ? 1 :0)], // pipe
            
            [ 'key'=> 'R', 'value'=> trans_choice('global.R_celibefigli', $sex === 'F' ? 1 :0) ], // pipe
            [ 'key'=> 'S', 'value'=> __('global.S_separato',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> 'T', 'value'=> __('global.T_configliriconosciuti') ],

            [ 'key'=> 'U', 'value'=> __('global.U_configliacarico') ],
            [ 'key'=> 'V', 'value'=> __('global.V_vedovo',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            
            [ 'key'=> 'W', 'value'=> trans_choice('global.W_celibeconfigli', $sex === 'F' ? 1 :0) ], // pipe
            
            [ 'key'=> 'X', 'value'=> __('global.X_separatoconfigli',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            
            [ 'key'=> 'Y', 'value'=> __('global.Y_divorziatoconfigli',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            
            [ 'key'=> 'Z', 'value'=> __('global.Z_coniugatodetrazioni',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> '0', 'value'=> __('global.O_nonassegnato') ],
            [ 'key'=> 'O', 'value'=> __('global.O_nonassegnato') ],
            [ 'key'=> 'M', 'value'=> __('global.M_deceduto',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
            [ 'key'=> 'E', 'value'=> __('global.E_tutelato',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],        
            [ 'key'=> 'Q', 'value'=> __('global.Q_unitocivilmente',  [ 's'=> Anagrafica::genderTranslate($sex) ]) ],
        ];
    }


}
