<?php

namespace App\Models\Ugov;

use Illuminate\Database\Eloquent\Model;
use DB;

class ContrUgov extends DGUgov
{
    protected $connection = 'oracle';    
    protected $table = 'V_IE_DG11_X_CONTR';

    protected $casts = [
        'dt_fin_val' => 'datetime:d-m-Y',    
        'dt_ini_val' => 'datetime:d-m-Y',        
    ];
    
    
    protected $appends = ['statocompensi','statoordinativi'];

    protected $nome_tipo_dg = 'CONTRATTO_A_PERSONALE';

    static protected function getNomeTipoDgValue(){
        return 'CONTRATTO_A_PERSONALE';
    }

    public function relazioni()
    {
        return $this->hasMany(RelazioniDgUgov::class, 'id_dg_1', 'id_dg');
    }


    public function compensirel()
    {
        return $this->hasMany(RelazioniDgUgov::class, 'id_dg_1','id_dg')->distinti();
    }

    public function compensi()
    {
        return $this->hasManyThrough(
            CompensoUgov::class, 
            RelazioniDgUgov::class, 
            'id_dg_1', 
            'id_dg',
            'id_dg',
            'id_dg_2'
        )
        ->whereNull('V_IE_DG15_X_COMPENSO.dt_annullamento')
        ->select([
            'V_IE_DG15_X_COMPENSO.id_x_compenso','V_IE_DG15_X_COMPENSO.id_dg','V_IE_DG15_X_COMPENSO.dt_ini_val','V_IE_DG15_X_COMPENSO.dt_fin_val','V_IE_DG15_X_COMPENSO.dt_validazione','V_IE_DG15_X_COMPENSO.id_ind_sede','V_IE_DG15_X_COMPENSO.dt_prot','V_IE_DG15_X_COMPENSO.dt_annullamento',
            'V_IE_DG15_X_COMPENSO.dt_adempimenti','V_IE_DG15_X_COMPENSO.ti_campo_attivita','V_IE_DG15_X_COMPENSO.dt_ins','V_IE_DG15_X_COMPENSO.dt_versamenti','V_IE_DG15_X_COMPENSO.dt_mod','V_IE_DG15_X_COMPENSO.cd_tipo_tass','V_IE_DG15_X_COMPENSO.cd_prev_cassa','V_IE_DG15_X_COMPENSO.nr_prot',
            'V_IE_DG15_X_COMPENSO.pgverrec','V_IE_DG15_X_COMPENSO.cd_attiv_inps',
            'V_IE_DG15_X_COMPENSO.cd_assic_prev','V_IE_DG15_X_COMPENSO.cd_tipo_compenso','V_IE_DG15_X_COMPENSO.cd_adempimento'])
        ->distinct();    
    }

    public function relazionirate()
    {
        return $this->hasMany(RelazioneRateUgov::class, 'id_dg_ref_a', 'id_dg')->whereNull('V_IE_DG11_R_RATE_COMPENSO.dt_annullamento');
    }

    public function relazioniratecompenso()
    {
        return $this->hasMany(RelazioneRateUgov::class, 'id_dg_ref_a', 'id_dg')
            ->whereNull('V_IE_DG11_R_RATE_COMPENSO.dt_annullamento')
            ->whereNotNull('V_IE_DG11_R_RATE_COMPENSO.id_dg_ref_b');
    }


    public function relazioniratecompensoordinativo()
    {
        return $this->hasMany(RelazioneRateUgov::class, 'id_dg_ref_a', 'id_dg')
            ->whereNull('V_IE_DG11_R_RATE_COMPENSO.dt_annullamento')
            ->whereNotNull('V_IE_DG11_R_RATE_COMPENSO.id_dg_ref_b')
            ->has('compenso.ordinativi');
            
    }


    public function rate(){
        return $this->hasManyThrough(
            RataUgov::class, 
            RelazioneRateUgov::class, 
            'id_dg_ref_a', 
            'id_x_rate',
            'id_dg',
            'id_X_rate'
        )->whereNull('V_IE_DG11_R_RATE_COMPENSO.dt_annullamento');
    }


    //numero di compensi == numero di rate OK
    public function getStatocompensiAttribute(){

        if ($this->compensi == null || $this->compensi->count() == 0){
            return "Nessun compenso";
        }else{                        
            return $this->compensi->implode('id_dg',', ');            
        }        
    }

    public function getStatoordinativiAttribute(){

        if ($this->compensi == null || $this->compensi->count() == 0){
            return "Nessun ordinativo";
        }else{      
            $str = null;            
            foreach ($this->compensi as $compenso) {
                if ($compenso->ordinativi == null || $compenso->ordinativi->count() == 0 ){
                    $str = ($str==null ? $str : $str.' ').'Compenso ('.$compenso->id_dg.'): nessun ordinativo';
                }else{
                    $str =  ($str==null ? $str : $str.' ').'Compenso ('.$compenso->id_dg.'): '.$compenso->ordinativi->implode('id_dg',', ');
                }                
            }      
            return $str;            
        }        
    }
}


