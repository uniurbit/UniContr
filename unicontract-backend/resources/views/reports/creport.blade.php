<h4>QUADRO C: PRESTAZIONE PROFESSIONALE (art. 53, comma 1, D.P.R. 917/1986)</h4>
<p class="normal">    
    Ai sensi ed agli effetti dell’applicazione della normativa fiscale e previdenziale, si dichiara che l’attività oggetto di contratto rientra nell’oggetto proprio dell’arte o professione esercitata e pertanto costituisce reddito di lavoro autonomo imponibile ai fini dell’I.V.A. (obbligo di rilascio fattura sul compenso art. 5, comma 1, D.P.R. 633/1972). 
    <br>A tal proposito si dichiara di: <br>

    <!--Partita I.V.A.-->
    - {{ __('global.c_txt4') }} @if ($pre->cPrestazioneProfessionale->tipologia == 0) individuale @else studio associato @endif n. {{ $pre->cPrestazioneProfessionale->piva }}  {{ __('global.c_txt4b') }} {{ $pre->cPrestazioneProfessionale->intestazione }}
    <br>

    <!--iscritto all'Albo/Elenco-->
    @if ($pre->cPrestazioneProfessionale->flag_albo == 0)    
      - {{ __('global.c_txt5b') }} <br>
    @else
      - {{ __('global.c_txt5') }} {{ $pre->cPrestazioneProfessionale->denominazione_albo }} {{  __('global.c_txt5c') }} {{ $pre->cPrestazioneProfessionale->provincia_albo }} {{ __('global.c_txt5d') }} {{ $pre->cPrestazioneProfessionale->num_iscrizione_albo }} {{ __('global.c_txt5e') }} {{ $pre->cPrestazioneProfessionale->data_iscrizione_albo }}
      <br>
    @endif    
 
    <!-- cassa previdenziale -->
    @if($pre->cPrestazioneProfessionale->flag_cassa == 0)         
        - {{ __('global.c_txt7')}} <br>
    @else        
        - {{ __('global.c_txt6') }} {{ $pre->cPrestazioneProfessionale->denominazione_cassa }} @if(!$pre->cPrestazioneProfessionale->contributo_cassa) {{ __('global.c_txt6b') }} @else {{ __('global.c_txt6c') }}@endif
        <br>
    @endif      

    <!--rivalsa-->      
    @if($pre->cPrestazioneProfessionale->flag_rivalsa == 0)        
        - {{ __('global.c_txt8b') }} <br>
    @else          
        - {{ __('global.c_txt8') }} <br>
    @endif

     <!--regime fiscale aggevolato-->
    @if($pre->cPrestazioneProfessionale->flag_regime_fiscale == 0)
        - {{ __('global.c_txt9b') }} <br>
    @else
        - {{ __('global.c_txt9') }} <br>  
    @endif
</p>
<br>
<p class="piepagina">  
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->cPrestazioneProfessionale->updated_at ? $pre->cPrestazioneProfessionale->updated_at->format('d-m-Y') : $pre->cPrestazioneProfessionale->created_at->format('d-m-Y')}} <br>
</p>