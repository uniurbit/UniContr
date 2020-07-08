{{-- // ALTA QUALIFICAZIONE
// NUOVA ATTRIBUZIONE --}}
@if($pre->isAltaQualificazione())
@if($pre->isNuovo())
<p class="normal">   
- che, ai sensi dell'art. 4 del suddetto regolamento il {{$pre->tipoEmitt}} del {{$pre->dipartimento}} con {{$pre->tipoAtto}} ha conferito, 
tramite contratto di diritto privato, {{$pre->genere['str4']}} {{$pre->genere['str5']}} l'insegnamento di alta qualificazione di {{$pre->insegnamentoDescr}} 
{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} per l'anno accademico  {{$pre->aa}};
</p>
<p class="normal">
- che il Nucleo di Valutazione Interna dell'Ateneo, ai sensi dell'art. 2, co. 1, lett. r) della Legge 240/2010 
e dell'art. 4, co. 5 del Regolamento soprarichiamato, ha espresso parere favorevole all'attribuzione del suddetto insegnamento;
</p>
@else
{{-- // RINNOVO --}}
<p class="normal">   
- che per il precedente anno accademico è stato {{$pre->rinnovo['storico']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}}, tramite contratto di diritto privato, 
l'insegnamento di alta qualificazione di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} 
presso il {{$pre->dipartimento}};
</p>
<p class="normal">   
- che ai sensi dell'art. 6, co. 2 del suddetto regolamento, il {{$pre->tipoEmitt}} dello stesso Dipartimento con {{$pre->tipoAtto}}, 
per le motivazioni ivi espresse, ha {{$pre->rinnovo['text_rinnovo_1']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}} 
per l'anno accademico  {{$pre->aa}}, {{$pre->periodo}} il conferimento del contratto di diritto privato per lo svolgimento dell'insegnamento 
alta qualificazione di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}}, 
{{$pre->rinnovo['text_rinnovo_2']}} per il precedente anno accademico;
</p>
@endif

@elseif ($pre->isDidatticaUfficiale())
{{-- // CONTRATTO DIDATTICA UFFICIALE --}}
@if($pre->isNuovo())
<p class="normal">  
- che, in seguito allo svolgimento di apposita procedura di selezione pubblica bandita ai sensi dell'art. 3 
del suddetto regolamento, il {{$pre->tipoEmitt}} del {{$pre->dipartimento}} con {{$pre->tipoAtto}} ha conferito, tramite contratto di 
diritto privato, {{$pre->genere['str4']}} {{$pre->genere['str5']}} l'insegnamento ufficiale di {{$pre->insegnamentoDescr}}
{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} per l'anno accademico {{$pre->aa}};
</p>
@else
{{-- // RINNOVO --}}
<p class="normal">  
- che per il precedente anno accademico è stato {{$pre->rinnovo['storico']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}}, tramite contratto di diritto privato, l'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} presso il {{$pre->dipartimento}};
</p>
<p class="normal">  
- che ai sensi dell'art. 6, comma 2 del suddetto regolamento, il {{$pre->tipoEmitt}} dello stesso Dipartimento con {{$pre->tipoAtto}}, 
per le motivazioni ivi espresse, ha {{$pre->rinnovo['text_rinnovo_1']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}} per l'anno accademico {{$pre->aa}}, {{$pre->periodo}} il conferimento del contratto di diritto privato per lo svolgimento dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}
{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}}, {{$pre->rinnovo['text_rinnovo_2']}} per il precedente 
anno accademico;
</p>
@endif

@elseif ($pre->isDidatticaIntegrativa())
{{-- // CONTRATTO DIDATTICA INTEGRATIVA  --}}
@if($pre->isNuovo())
<p class="normal">        
    - che, in seguito allo svolgimento di apposita procedura di selezione pubblica bandita ai sensi dell'art. 3 del suddetto regolamento, il
    {{$pre->tipoEmitt}} del {{$pre->dipartimento}} con {{$pre->tipoAtto}} ha conferito, 
    tramite contratto di diritto privato, lo svolgimento del corso integrativo dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}
    {{$pre->settore}}, {{$pre->ore}} ore, corso di laurea in {{$pre->cdl}} per l'anno accademico {{$pre->aa}};
</p>
@else 
<p class="normal">
    - che per il precedente anno accademico è stato {{$pre->rinnovo['storico']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}}, 
    tramite contratto di diritto privato, lo svolgimento del corso integrativo dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}
   {{$pre->settore}}, {{$pre->ore}} ore, corso di laurea in {{$pre->cdl}} presso il {{$pre->dipartimento}};          
</p>
<p class="normal">
    - che ai sensi dell'art. 10, comma 2 del suddetto regolamento, il  {{$pre->tipoEmitt}} dello stesso Dipartimento con 
    {{$pre->tipoAtto}}, per le motivazioni ivi espresse, ha {{$pre->rinnovo['text_rinnovo_1']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}} 
    per l'anno accademico {{$pre->aa}}, {{$pre->periodo}} il conferimento del contratto di diritto privato per lo svolgimento del 
    corso integrativo dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, 
    {{$pre->ore}} ore, corso di laurea in {{$pre->cdl}}, {{$pre->rinnovo['text_rinnovo_2']}} per il precedente anno accademico;
</p>
@endif

@elseif ($pre->isSupportoDidattica())
{{-- // CONTRATTO DI SUPPORTO ALLA DIDATTICA
// NUOVA ATTRIBUZIONE --}}
@if($pre->isNuovo())
<p class="normal">  
- che ai sensi dell'art. 8, comma 4, del suddetto regolamento, il {{$pre->tipoEmitt}} del {{$pre->dipartimento}} con {{$pre->tipoAtto}} ha 
conferito {{$pre->genere['str4']}} {{$pre->genere['str5']}}, tramite contratto di diritto privato, lo svolgimento di attività di supporto alla 
didattica all'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}} per l'anno accademico  {{$pre->aa}};
</p>
@else
{{-- // RINNOVO --}}
<p class="normal">  
- che per il precedente anno accademico è stato {{$pre->rinnovo['storico']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}}, 
tramite contratto di diritto privato, lo svolgimento di attività di supporto alla didattica all'insegnamento ufficiale 
di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, corso di laurea in {{$pre->cdl}} 
presso il {{$pre->dipartimento}};
</p>
<p class="normal">  
- che ai sensi dell'art. 10, comma 2 del suddetto regolamento, il {{$pre->tipoEmitt}} dello stesso Dipartimento con {{$pre->tipoAtto}}, 
per le motivazioni ivi espresse, ha {{$pre->rinnovo['text_rinnovo_1']}} {{$pre->genere['str4']}} {{$pre->genere['str5']}} per 
l'anno accademico  {{$pre->aa}}, {{$pre->periodo}} il conferimento del contratto di diritto privato per lo svolgimento di attività di supporto 
alla didattica all'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}}, {{$pre->rinnovo['text_rinnovo_2']}} per il precedente anno accademico;
</p>
@endif
@endif