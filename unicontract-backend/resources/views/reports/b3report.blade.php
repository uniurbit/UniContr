<h4>B.3: DICHIARAZIONE IN MERITO AL RAPPORTO DI STUDIO O LAVORO CON L'UNIVERSITÀ</h4>
<p class="normal">
    Si dichiara di:
        
@foreach  ($pre->b3rapportoUniv()->first()->rapporti()->get() as $item)            
    @if($item->tipologia_rapporto == 'DDR')
    <div> - {{ __('global.b3_txt1b') }} {{ $item->universita }}, {{ __('global.b3_txt2') }} {{ $item->dipartimento }} {{__('global.b3_txt6') }} {{ $item->dal_giorno }} {{__('global.b3_txt7') }} {{ $item->al_giorno }}</div>
    @endif
    @if($item->tipologia_rapporto == 'BDS')
    <div> - {{__('global.b3_txt5b') }} {{ $item->universita }}, {{__('global.b3_txt8') }} {{ $item->dipartimento }} {{__('global.b3_txt6') }} {{ $item->dal_giorno }} {{__('global.b3_txt7') }} {{ $item->al_giorno }}</div>
    @endif
    @if($item->tipologia_rapporto == 'BPD')
    <div> - {{__('global.b3_txt4b') }} {{ $item->universita }}, {{__('global.b3_txt8') }} {{ $item->dipartimento }} {{__('global.b3_txt6') }} {{ $item->dal_giorno }} {{__('global.b3_txt7') }} {{ $item->al_giorno }}</div>
    @endif
    @if($item->tipologia_rapporto == 'ADR')
    <div> - {{ __('global.b3_txt3b') }} {{ $item->universita }}, {{__('global.b3_txt8') }} {{ $item->dipartimento }}, {{__('global.b3_txt9') }} {{ $item->riferimenti_legge }} {{__('global.b3_txt6') }} {{ $item->dal_giorno }} {{ __('global.b3_txt7') }} {{ $item->al_giorno }}</div>
    @endif
    {{-- @if ($loop->last)
    This is the last iteration.
    @endif --}}
@endforeach    
</p>
<br>
<p class="piepagina">   
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->b3rapportoUniv->updated_at ? $pre->b3rapportoUniv->updated_at->format('d-m-Y') : $pre->b3rapportoUniv->created_at->format('d-m-Y')}} <br>
</p>