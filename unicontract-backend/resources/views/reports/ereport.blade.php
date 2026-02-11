<h4>QUADRO E: PRESTAZIONE DI LAVORO AUTONOMO OCCASIONALE (artt. 2222 e ss. del Cod. Civ.)</h4>
<p class="normal">    
    Con riferimento ai redditi percepiti nell'anno e considerato l'art. 44 della Legge 326/2003 che prevede l'obbligo d'iscrizione alla Gestione separata INPS per i soggetti esercenti attività di lavoro autonomo occasionale, qualora il reddito annuo superi l'importo di euro 5.000,00, si dichiara di:<br>
    
    @if($pre->eAutonomoOcasionale->cod_limite_reddito== 'NASL')
    - non aver superato il limite di reddito che comporta l'iscrizione alla gestione separata e ci si impegna a comunicarne tempestivamente il superamento.
    @elseif($pre->eAutonomoOcasionale->cod_limite_reddito== 'AGR')
    - aver già ricevuto euro {{ $pre->eAutonomoOcasionale->importo }} derivanti da attività di prestazione di lavoro autonomo occasionale.
    @elseif($pre->eAutonomoOcasionale->cod_limite_reddito== 'ASLR')
 
        @switch($pre->eAutonomoOcasionale->gestione_separata)
        @case(1)    
        - {{__('global.e_txt5_bis')}} {{$pre->eAutonomoOcasionale->previdenza }} {{ __('global.cassa'.$pre->eAutonomoOcasionale->cod_cassa_previdenziale) }} <br>
        @break
        @case(2)
        - {{__('global.e_txt7')}} <br>
        @break
        @case(3)
        - {{__('global.e_txt8')}} <br>
        @break
        @case(4)    
        - {{__('global.e_txt9')}} <br>
        @break
        @case(5)    
        - {{__('global.e_txt10')}} <br>
        @break
        @case(6)    
        - {{__('global.e_txt6')}} <br>
        @break
        @default    
        @endswitch
        
    @endif
</p>
<br>
<p class="piepagina">  
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->eAutonomoOcasionale->updated_at ? $pre->eAutonomoOcasionale->updated_at->format('d-m-Y') : $pre->eAutonomoOcasionale->created_at->format('d-m-Y')}} <br>
</p>