<h4>QUADRO D.1: DICHIARAZIONE AI FINI PREVIDENZIALI</h4>
@if($pre->d1inps()->first()!=null)
<p class="normal">    
    Ai sensi dell'art. 2, comma 26 della Legge 335/1995, del Decreto Legge 81/2015, del Decreto Legge 75/2017 e della Legge 205/2017, si dichiara: <br>
       
    @if($pre->d1inps->flag_obbligo_contributivo == 0)          
        - {{ __('global.d1_txt1not')}} <br>
    @else
        - {{ __('global.d1_txt1')}} 
        @switch($pre->d1inps->specif_obbligo_contributivo)
        @case('D1A')    
        {{ __('global.d1_txt2')}} <br>
        @break
        @case('D1B')    
        {{ __('global.d1_txt3')}} <br>
        @break
        @case('D1C')    
        {{ __('global.d1_txt4')}} <br>
        @break
        @default    
        @endswitch  
    @endif

       
    @if($pre->d1inps->flag_gestione_separata == 0)             
      - {{ __('global.d1_txt5not')}} <br>
    @else
      - {{ __('global.d1_txt5')}}

      @switch($pre->d1inps->specif_gestione_separata)      
      @case('D2A')    
      {{ __('global.d1_txt6')}} <br>
      @break
      @case('D2B')    
      {{ __('global.d1_txt7')}} <br>
      @break

      @default    
      @endswitch  
    
    @endif

   
    @if($pre->d1inps->flag_misura_ridotta == 0)    
        - {{ __('global.d1_txt8not')}}
    @else
        - {{ __('global.d1_txt8')}}
        @switch($pre->d1inps->specif_misura_ridotta)      
        @case('D3A')    
        {{ __('global.d1_txt9')}} {{ __('global.d1_txt16')}} {{ $pre->d1inps->data_pensione }} {{ __('global.d1_txt10')}} <br>
        @break
        @case('D3B')    
        {{ __('global.d1_txt11')}} {{ __('global.d1_txt16')}} {{ $pre->d1inps->data_pensione }} {{ __('global.d1_txt12')}} <br>
        @break
        @case('D3C')    
        {{ __('global.d1_txt13')}} {{ __('global.cassa'.$pre->d1inps->cassa_gestioni_previdenziali) }} <br>
        @break
        @default    
        @endswitch 
    @endif
    

    @if($pre->d1inps->flag_partita_iva == 0)    
      - {{ __('global.d1_txt14not')}} <br>
    @else
      - {{ __('global.d1_txt14')}} <br>
    @endif
    
</p>

<br>
<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d1inps->updated_at ? $pre->d1inps->updated_at->format('d-m-Y') : $pre->d1inps->created_at->format('d-m-Y')}} <br>
</p>
@endif
<!--FINE QUADRO D1-->


<h4>QUADRO D.2: DICHIARAZIONE AI FINI ASSICURATIVI INAIL</h4>
@if($pre->d2inail()->first()!=null)
<p class="normal">    
{{__('global.d2_txt1') }}<br>

@switch($pre->d2inail->posizione_previdenziale)      
@case('INAIL7')  
- {{__('global.d2_txt2') }}<br>
@break
@case('INAIL10')  
- {{__('global.d2_txt3') }}<br>
@break
@case('INAIL4')  
- {{__('global.d2_txt4') }}<br>
@break
@case('NOINAIL')  
- {{__('global.d2_txt5') }}<br>
@break
@default    
@endswitch      
</p>
<br>
<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d2inail->updated_at ? $pre->d2inail->updated_at->format('d-m-Y') : $pre->d2inail->created_at->format('d-m-Y')}} <br>
</p>
@endif
<!--FINE QUADRO D2-->

<h4>QUADRO D.3: DICHIARAZIONE AI FINI TRIBUTARI</h4>
@if($pre->d3tributari()->first()!=null)
<p class="normal">    
{{__('global.d3_txt1') }}<br>

<!-- - non aver percepito nel ...-->
@if($pre->d3tributari->flag_percepito == 0)- {{__('global.d3_txt2') }} @else- {{__('global.d3_txt3') }}  @endif 
@if($pre->d3tributari->flag_limite_percepito == 0){{__('global.d3_txt4') }} <br> @else {{__('global.d3_txt5') }} <br> @endif
<br>
</p>
@if($pre->d3tributari->flag_percepito == 1 && $pre->d3tributari->enti()->get() != null && $pre->d3tributari->enti()->count() > 0)
<table style="width: 100%">
    <thead>
        <tr>
            <th style="width: 24%;">Denominazione ente</th>
            <th style="width: 24%;">Natura incarico/rapporto</th>
            <th style="width: 12%;">Dal giorno</th>
            <th style="width: 12%;">Al giorno</th>
            <th style="width: 14%;">Importo totale</th>
            <th>Importo annuo</th>
        </tr>   
    </thead>
    <tbody>
        @foreach ($pre->d3tributari->enti as $item)       
        <tr>
            <td>{{$item->ente }}</td>
            <td>{{$item->rapporto }}</td> 
            <td>{{$item->dal_giorno }} </td>
            <td>{{$item->al_giorno }}</td>
            <td>{{$item->importo_totale }}€ </td>
            <td>{{$item->importo_annuo }}€ </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endif
<br>
<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d3tributari->updated_at ? $pre->d3tributari->updated_at->format('d-m-Y') : $pre->d3tributari->created_at->format('d-m-Y')}} <br>
</p>
@endif
<!--FINE QUADRO D3-->

<h4>QUADRO D.4: RICHIESTA AI FINI FISCALI</h4>
@if($pre->d4fiscali()->first()!=null)
<p class="normal">    
    Ai fini fiscali si richiede di: <br>

- applicare l'aliquota IRPEF sui redditi percepiti pari al {{ $pre->d4fiscali->percentuale_aliquota_irpef }}% <br>
        
@if($pre->d4fiscali->flag_detrazioni==1)
    - {{__('global.d4_txt3', ['anno'=> $pre->insegnamento->anno_contribuzione ])}} {{__('global.d4_txt4') }} 
    @if($pre->d4fiscali->detrazioni == 'RCC'){{ __('global.d4_txt5') }} <br> @endif
    @if($pre->d4fiscali->detrazioni == 'RCD'){{ __('global.d4_txt6') }} pari ad {{ $pre->d4fiscali->reddito }}€ <br> @endif
@else  
    - {{__('global.d4_txt2') }} <br>
@endif
  
@if(!is_null($pre->d4fiscali->flag_bonus_renzi))  
@if($pre->d4fiscali->flag_bonus_renzi == 1)    
    - {{__('global.d4_txt7', ['anno'=> $pre->insegnamento->anno_contribuzione ]) }}  <br>   
@else
    - non {{__('global.d4_txt7') }} <br>       
@endif  
@endif

@if(!is_null($pre->d4fiscali->flag_detrazioni_21_2020))  
@if($pre->d4fiscali->flag_detrazioni_21_2020==1)
    - {{__('global.d4_intest4')}}
    {{-- @if($pre->d4fiscali->detrazioni_21_2020 == 'TI21'){{ __('global.d4_txt7_ti21') }} <br> @endif
    @if($pre->d4fiscali->detrazioni_21_2020 == 'D21'){{ __('global.d4_txt8_d21') }}, reddito stimato {{ $pre->d4fiscali->reddito_21_2020 }}€ <br> @endif --}}
@else  
    - non {{__('global.d4_intest4') }} <br>   
@endif
@endif



</p>
<br>
<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d4fiscali->updated_at ? $pre->d4fiscali->updated_at->format('d-m-Y') : $pre->d4fiscali->created_at->format('d-m-Y')}} <br>
</p>
@endif

@if($pre->d5fiscaliestero()->first() !=null && $pre->anagrafica->provincia_fiscale == 'EE')
    <h4>QUADRO D.5: DICHIARAZIONE AI FINI FISCALI PER I RESIDENTI ALL'ESTERO</h4>
    <p class="normal">    
        Ai fini fiscali si dichiara: <br>
    
    - {{__('global.d5_txt1') }} <br>

    @if($pre->d5fiscaliestero->flag_convenzione_bilaterale == 1)
    - {{__('global.d5_txt2') }}  <br>
    @else
    - {{__('global.d5_txt3') }} <br>
    @endif

    @if($pre->d5fiscaliestero->flag_gestione_separata == 1)
    - {{__('global.d5_txt7') }} <br>
    @else
    - {{__('global.d5_txt8') }} <br>
    @endif
    </p>
    <br>
    <p class="piepagina">    
        Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d5fiscaliestero->updated_at ? $pre->d5fiscaliestero->updated_at->format('d-m-Y') : $pre->d5fiscaliestero->created_at->format('d-m-Y')}} <br>
    </p>
@endif

<h4>QUADRO D.6: RICHIESTA DETRAZIONI FISCALI PER FAMILIARI A CARICO</h4>
@if($pre->d6familiari()->first()!=null)
<p class="normal">        
    @if($pre->d6familiari->flag_richiesta_detrazioni == 0)
    {{__('global.d6_txt2') }} <br>
    @else
    {{__('global.d6_premessa1') }}{{__('global.d6_premessa2') }}   <br>
    
        @if($pre->d6familiari->flag_coniuge_carico == 1)        
        <br>
        - {{__('global.d6_txt1') }} {{__('global.d6_label1') }} {{ $pre->d6familiari->dal_giorno }}. <br>
        @endif           
        @if($pre->d6familiari->flag_richiesta_detrazioni == 1 && $pre->d6familiari->familiari()->get() !== null && $pre->d6familiari->familiari->count()>0)
        <table  style="width: 100%">
        <thead>
            <tr>      
            <th>Relazione di parentela</th>     
            <th>Cognome</th>
            <th>Nome</th>     
            <th class="text-center">Codice fiscale</th>
            <th class="text-center">Data di nascita</th>
            <th class="text-center">Detrazione Fiscale</th>
            <th class="text-center">Disabilità</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($pre->d6familiari->familiari as $item)      
            <tr>       
            <td>{{ __('global.'.$item->parentela) }}</td>          
            <td>{{ $item->cognome}}</td>
            <td>{{ $item->nome }}</td>
            <td class="text-center">{{ $item->cod_fiscale }}</td>
            <td class="text-center">{{ $item->data_nascita }}</td>
            <td class="text-center">{{ $item->percentuale_detrazione }}%</td>
            <td class="text-center">{{ $item->flag_disabilita == 1 ? 'Si' : 'No' }}</td>
            </tr>
            @endforeach
        </tbody>          
        </table>        
        @endif
    @endif
    <br>
    <p class="piepagina">    
        Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->d6familiari->updated_at ? $pre->d6familiari->updated_at->format('d-m-Y') : $pre->d6familiari->created_at->format('d-m-Y')}} <br>
    </p>
</p>
@endif

