<h4>B.4: DICHIARAZIONE IN MERITO AL RAPPORTO DI LAVORO CON LA P.A.</h4>
<p class="normal">    

@foreach($pre->b4rapportopa->pubblamm()->get() as $item)    

    {{-- Si dichiara di essere dipendente della seguente Pubblica Amministrazione: {{$item->denom}}
    if($time == 'TIND') { 
        if($pti == "") {
            $string2 = "a tempo indeterminato con regime di lavoro a tempo pieno";
        } else {
            $string2 = "a tempo indeterminato con regime di lavoro a tempo parziale (".$pti." %)";
        }
    } else if ($time == 'TDET') {
        if($ptd == "") {
            $string2 = "a tempo determinato per il periodo dal ".$dal." al ".$al."con regime di lavoro a tempo pieno";
        } else {
            $string2 = "a tempo determinato per il periodo dal ".$dal." al ".$al."con regime di lavoro a tempo parziale  (".$ptd." %)";
        }
    } else if ($time == 'ASP') {
        
        $string2 = "e di essere in aspettativa senza assegno a decorrere dal ".$data_asp;
    }
    $string3 = "Si dichiara altresì:";
    if($noattiv == 0) { 
        $string4 = "- di non esercitare attività professionale";
    } else { 
        $string4 = "- di esercitare la seguente attività professionale: ".$profess;
    }
    if($noalbo == 0) { 
        $string5 = "- di non essere iscritt$str2 ad albi professionali";
    } else {
        $string5 = "- di essere iscritt$str2 al seguente albo professionale: ".$albo;
    } --}}
    @if($pre->b4rapportopa->tipo_rapporto == 'ASP') 
    <div> - {{__('global.b4_txt1b')  }} {{$item->denominazione_pa }} {{__('global.b4_txt4')  }} {{__('global.b4_txt25')  }} {{$item->dal_giorno }} </div>
    @endif

    @if($pre->b4rapportopa->tipo_rapporto == 'TIND')
    <div>{{ __('global.b4_txt1b')  }} {{$item->denominazione_pa }} {{__('global.b4_txt2')  }} {{__('global.b4_txt5')  }} {{ $pre->b4rapportopa->tempoPienoToString() }}@if($pre->b4rapportopa->tempo_pieno === 0) ({{$item->percentuale }} %). @else. @endif
    </div>
    @endif

    @if($pre->b4rapportopa->tipo_rapporto == 'TDET')
    <div>{{__('global.b4_txt1b')  }} {{$item->denominazione_pa }} {{__('global.b4_txt3')  }} {{__('global.b4_txt23') }} {{$item->dal_giorno }} {{__('global.b4_txt24') }} {{$item->al_giorno }} {{__('global.b4_txt5')  }} {{ $pre->b4rapportopa->tempoPienoToString() }}
    @if($pre->b4rapportopa->tempo_pieno == 0) ({{$item->percentuale }} %) @endif
    </div>
    @endif
    
    Ai fini degli adempimenti di cui all'art.53, co.11 del D.Lgs. 165/2001 relativi all'Anagrafe delle prestazioni, comunica i dati della Pubblica Amministrazione di appartenenza: <br>
    
    Denominazione: {{$item->denominazione_pa}}<br>
    Codice Fiscale: {{$item->cod_fisc_pa}}<br>
    Partita IVA: {{$item->piva_pa}}<br>
    Indirizzo: {{$item->indirizzo_pa}} n. {{$item->num_civico_pa}}<br>
    Comune: {{$item->comune_pa}} ({{$item->provincia_pa}}), CAP {{$item->cap_pa}}<br>
    @if($item->num_telefono_pa) Telefono: {{$item->num_telefono_pa}} <br> @endif
    @if($item->num_fax_pa) Fax: {{$item->num_fax_pa}} <br> @endif
    @if($item->email_pa) email: {{$item->email_pa}} <br> @endif
    @if($item->pec_pa) PEC: {{$item->pec_pa}}<br> @endif

@endforeach  
</p>

<br>
Si dichiara altresì di: <br>

@if($pre->b4rapportopa->attivita_professionale == 0) 
    - non esercitare attività professionale <br>
@else
    - esercitare la seguente attività professionale: {{$pre->b4rapportopa->descrizione_attivita}} <br>
@endif

@if($pre->b4rapportopa->iscrizione_albo == 0)  
    - non essere @if($pre->anagrafica->sesso == 'M') iscritto @else iscritta @endif ad albi professionali <br>
@else
    - essere @if($pre->anagrafica->sesso == 'M') iscritto @else iscritta @endif al seguente albo professionale: {{$pre->b4rapportopa->descrizione_albo}} <br>
@endif

<br>

<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->b4rapportopa->updated_at ? $pre->b4rapportopa->updated_at->format('d-m-Y') : $pre->b4rapportopa->created_at->format('d-m-Y')}} <br>
</p>