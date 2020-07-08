<?php

namespace App\Exports;

use App\Precontrattuale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;

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
            $precontr->insegnamento ? $precontr->insegnamento->coper_id : '',
            $precontr->insegnamento ? $precontr->insegnamento->aa : '',
            $precontr->insegnamento ? $precontr->insegnamento->data_ini_contr : '',
            $precontr->insegnamento ? $precontr->insegnamento->data_fine_contr: '',
            $precontr->user ? $precontr->user->name: '',
            $precontr->user ? $precontr->user->cf: '',
            $precontr->user ? $precontr->user->email: '',
            
            $precontr->anagrafica ? $precontr->anagrafica->sesso : '',
            $precontr->anagrafica ? (($precontr->anagrafica->data_nascita != null) ? $precontr->anagrafica->data_nascita :'') : '',
            $precontr->anagrafica ? (($precontr->anagrafica->comune_nascita != null) ? $precontr->anagrafica->comune_nascita :'') : '',

            $precontr->p2naturarapporto ? ($precontr->p2naturarapporto->flag_titolare_pensione == 1 ? 'si' : 'no') : '',

            $precontr->insegnamento ? $precontr->insegnamento->insegnamento: '',
            $precontr->insegnamento ? $precontr->insegnamento->settore: '',
            $precontr->insegnamento ? $precontr->insegnamento->cod_settore: '',
            $precontr->insegnamento ? $precontr->insegnamento->cdl: '',
            $precontr->insegnamento ? $precontr->insegnamento->cfu: '',
            $precontr->insegnamento ? $precontr->insegnamento->ore: '',
            $precontr->insegnamento ? $precontr->insegnamento->compenso: '',
            $precontr->insegnamento ? $precontr->insegnamento->dipartimento: '',
            $this->naturaRapporto($precontr->p2naturarapporto),
            $this->tipoContratto($precontr->insegnamento->tipo_contratto),
            $precontr->insegnamento ? $precontr->insegnamento->tipo_atto: '',
            $precontr->insegnamento ? $precontr->insegnamento->emittente: '',
            $this->tipoConferimento($precontr->insegnamento->motivo_atto),
            $precontr->insegnamento ? $precontr->insegnamento->num_delibera: '',
            $precontr->insegnamento ? $precontr->insegnamento->data_delibera: '',
            $precontr->currentState           
        ];
    }

    public function headings(): array
    {
        return [
            '#',
            'Anno Offerta Formativa',
            'Data inizio',
            'Data fine',
            'Nominativo',
            'Codice Fiscale',
            'Email',
            'Sesso',
            'Data nascita',
            'Luogo nascita',
            'Stato pensionamento',
            'Insegnamento',
            'Epigrafe S.S.D.',
            'Codice S.S.D.',
            'C.D.L.',
            'CFU',
            'Ore',
            'Compenso',
            'Dipartimento',
            'Natura del rapporto',
            'Tipo contratto',
            'Tipo atto',
            'Emittente',
            'Motivo atto',
            'Num. Delibera',
            'Data delibera',
            'Stato corrente',
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


}
