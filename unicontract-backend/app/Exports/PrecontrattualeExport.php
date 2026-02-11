<?php

namespace App\Exports;

use App\Precontrattuale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;
use Exception;

class PrecontrattualeExport implements FromCollection, WithMapping, WithHeadings
{

    use Exportable;

    public function __construct($request, $findparam)
    {
        $this->request = $request;
        $this->findparam = $findparam;
    }
      

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {               
        $collection = UtilService::alldata(new Precontrattuale, $this->request, $this->findparam);        
        return $collection;
    }

      /**
    * @var Precontrattuale $precontr
    */
    public function map($precontr): array
    {      
        return [
            $precontr->id,
            $precontr->insegnamento ? $precontr->insegnamento->coper_id : '',
            $precontr->insegnamento ? $precontr->insegnamento->aa : '',
            $precontr->insegnamento ? $precontr->insegnamento->data_ini_contr : '',
            $precontr->insegnamento ? $precontr->insegnamento->data_fine_contr: '',
            
            $precontr->user ? $precontr->user->cognome: '',
            $precontr->user ? $precontr->user->nome: '',

            $precontr->user ? $precontr->user->cf: '',
            $precontr->user ? $precontr->user->email: '',
            
            $precontr->anagrafica ? $precontr->anagrafica->sesso : '',
            $precontr->anagrafica ? (($precontr->anagrafica->data_nascita != null) ? $precontr->anagrafica->data_nascita :'') : '',
            $precontr->anagrafica ? (($precontr->anagrafica->comune_nascita != null) ? $precontr->anagrafica->comune_nascita :'') : '',
            $precontr->anagrafica ?  (($precontr->anagrafica->nazione_residenza != null) ? $precontr->anagrafica->nazione_residenza :'') : '', 

            $precontr->anagrafica ? $precontr->anagrafica->datiDomicilioFiscaleReport() : '',

            $precontr->p2naturarapporto ? ($precontr->p2naturarapporto->flag_titolare_pensione == 1 ? 'si' : 'no') : '',
            $precontr->p2naturarapporto ? ($precontr->p2naturarapporto->flag_dipend_pubbl_amm == 1 ? 'si' : 'no') : '',

            $precontr->insegnamento ? $precontr->insegnamento->insegnamento: '',
            $precontr->insegnamento ? $precontr->insegnamento->settore: '',
            $precontr->insegnamento ? $precontr->insegnamento->cod_settore: '',
            $precontr->insegnamento ? $precontr->insegnamento->cdl: '',
            $precontr->insegnamento ? $precontr->insegnamento->cfu: '',
            $precontr->insegnamento ? $precontr->insegnamento->ore: '',
            $precontr->insegnamento ? $precontr->insegnamento->compenso: '',
            $precontr->insegnamento ? $precontr->insegnamento->dipartimento: '',
            $this->getScuola($precontr),             
            $this->naturaRapporto($precontr->p2naturarapporto),
            $this->tipoContratto($precontr->insegnamento->tipo_contratto),
            $precontr->insegnamento ? $precontr->insegnamento->tipo_atto: '',
            $precontr->insegnamento ? $precontr->insegnamento->emittente: '',
            $this->tipoConferimento($precontr->insegnamento->motivo_atto),
            $precontr->insegnamento ? $precontr->insegnamento->num_delibera: '',
            $precontr->insegnamento ? $precontr->insegnamento->data_delibera: '',

            $precontr->a2modalitapagamento && $precontr->a2modalitapagamento->modality == 'ACIC' ? 
                $precontr->a2modalitapagamento->iban : '',

            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d1inps 
                ? ($precontr->d1inps->flag_gestione_separata == 0 ? 'no' : 'si') : '',

            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d1inps 
                ? ($precontr->d1inps->flag_misura_ridotta == 0 ? 'no' : 'si') : '',

            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d1inps 
                ? (($precontr->d1inps->flag_misura_ridotta == 1 && $precontr->d1inps->specif_misura_ridotta == 'D3C') 
                    ? (!is_null($precontr->d1inps->cassa_gestioni_previdenziali) && !empty($precontr->d1inps->cassa_gestioni_previdenziali) 
                        ? __('global.cassa'.$precontr->d1inps->cassa_gestioni_previdenziali) : '') 
                    : '') 
                : '',

            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d2inail
                ?  __('global.'.$precontr->d2inail->posizione_previdenziale) : '', 

            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d4fiscali 
                ?  $precontr->d4fiscali->percentuale_aliquota_irpef.' %': '', 
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d4fiscali 
                ?  ($precontr->d4fiscali->flag_detrazioni == 0 ? 'no' : 'si') : '',
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d4fiscali && !is_null($precontr->d4fiscali->flag_bonus_renzi) 
                ?  ($precontr->d4fiscali->flag_bonus_renzi == 0 ? 'no' : 'si') : '',
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d4fiscali && !is_null($precontr->d4fiscali->flag_detrazioni_21_2020) 
                ?  ($precontr->d4fiscali->flag_detrazioni_21_2020 == 0 ? 'no' : 'si') : '',
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'COCOCO') && $precontr->d6familiari
                ?  ($precontr->d6familiari->flag_richiesta_detrazioni == 0 ? 'no' : 'si') : '',

            //partita iva
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ? 
                $precontr->cPrestazioneProfessionale->piva : '',
            //intestazione
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ? 
                $precontr->cPrestazioneProfessionale->intestazione : '', 
            //tipologia
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ? 
                ($precontr->cPrestazioneProfessionale->tipologia == 0 ? 'individuale' : 'studio associato') : '',

            //albo
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_albo == 0 ? 'no' : 'si') : '', //albo professionale
            //denominazione
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_albo == 0 ? '' : $precontr->cPrestazioneProfessionale->denominazione_albo) : '', //denominazione

            //cassa
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_cassa == 0 ? 'no' : 'si') : '', //cassa
            //denominazione
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_cassa == 0 ? '' : $precontr->cPrestazioneProfessionale->denominazione_cassa) : '', //denominazione cassa
            //contributo
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_cassa == 0 ? '' : ($precontr->cPrestazioneProfessionale->contributo_cassa==0 ? '%4' : '%2')) : '',
            
            //rivalsa
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->flag_rivalsa == 0 ? 'no' : 'si') : '',

            //regime fiscale
            ($precontr->p2naturarapporto && $precontr->p2naturarapporto->natura_rapporto === 'PRPR') && $precontr->cPrestazioneProfessionale ?
                ($precontr->cPrestazioneProfessionale->regime_fiscale ? __('global.dichiaro_descr_'.$precontr->cPrestazioneProfessionale->regime_fiscale)  : '') : '',

            $precontr->currentState,         
            
            $precontr->flag_no_compenso == 0 ? '' : 'si'
        ];
    }

    public function headings(): array

    {
        return [
            '#',
            'Copertura',
            'Anno Offerta Formativa',
            'Data inizio',
            'Data fine',
            
            'Cognome',
            'Nome',

            'Codice Fiscale',
            'Email',
            'Sesso',
            'Data nascita',
            'Luogo nascita',
            'Cittadinanza',

            'Residenza fiscale',

            'Stato pensionamento',
            'Dipendente di P.A.',
            'Insegnamento',
            'Epigrafe S.S.D.',
            'Codice S.S.D.',
            'C.D.L.',
            'CFU',
            'Ore',
            'Compenso',
            'Dipartimento',
            'Scuola',

            'Natura del rapporto',
            'Tipo contratto',
            'Tipo atto',
            'Emittente',
            'Motivo atto',
            'Num. Delibera',
            'Data delibera',

            'IBAN',

            'Gestione separata',
            'INPS ridotta',
            'Cassa',
            'Inail',
            'Aliquota IRPEF',
            'Detrazioni',
            'Bonus Renzi',
            'Detrazione L. 21/2020',
            'Detrazioni familiari',

            'Partita Iva',
            'Intestazione',
            'Tipologia',
            'Albo',
            'Denominazione',
            'Cassa',
            'Denominazione',
            'Contributo',
            'Rivalsa',
            'Regime Fiscale',

            'Stato corrente',
            'Rinuncia al compenso'
        ];
    }

    public function tipoConferimento($value) {
        return UtilService::tipoConferimento($value);        
    }

    public function tipoContratto($value) {
        return UtilService::tipoContratto($value);          
    }

    public function naturaRapporto($p2naturarapporto) {
        return UtilService::naturaRapporto($p2naturarapporto);  
    }

    public function annoAccademico($perirodoInizio)
    {
        return ($perirodoInizio.'/'.($perirodoInizio+1));
    }

    // $precontr->insegnamento ? ($precontr->insegnamento->corsodistudio ? 
    //             ($precontr->insegnamento->corsodistudio->where('aa', $this->annoAccademico((int)$precontr->insegnamento->aa))->first() ? $precontr->insegnamento->corsodistudio->where('aa', $this->annoAccademico((int)$precontr->insegnamento->aa))->first()->scuola->scuola_nome : ''  ): '' ): '',
    public function getScuola($precontr){
        $result = '';
        try{
            if ($precontr->insegnamento) {
                if ($precontr->insegnamento->corsodistudio) {
                    $corsodistudio = $precontr->insegnamento->corsodistudio->where('aa', $this->annoAccademico((int)$precontr->insegnamento->aa))->first();
                    
                    if ($corsodistudio) {
                        $result = $corsodistudio->scuola->scuola_nome;
                    }
                }
            }

            return $result;
        }catch (Exception $e) {
            return 'Dato non reperibile';
        } 
    }

}
