<h4>SI CONVIENE E SI STIPULA QUANTO SEGUE</h4>
<h4>Art. 1 - Oggetto e durata</h4>
@if($pre->naturaRapporto == "PLAO")
<p class="normal">
{{$pre->genere['str0']}} {{$pre->genere['str5']}} si impegna a prestare, in favore dell'Università degli Studi di Urbino Carlo Bo, 
la propria opera intellettuale quale professore a contratto per lo svolgimento del corso integrativo dell'insegnamento ufficiale 
di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}}, 
per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}.<br>
Le parti si danno reciprocamente atto che la prestazione, al di fuori di qualsiasi rapporto di subordinazione ed altresì di un rapporto di collaborazione coordinata e continuativa, costituisce esplicazione di attività di lavoro autonomo, regolata dagli artt. 2222 e ss. del Codice Civile.
<br>Le parti riconoscono inoltre il carattere occasionale e sporadico della prestazione, 
tale da escludere qualsiasi accordo di continuità dell'incarico.<br>
Il presente contratto non può protrarsi oltre il periodo sopraindicato.
</p>
<!--  ALTA QUALIFICAZIONE NUOVA -->
@elseif($pre->isAltaQualificazione())
<p class="normal">
@if($pre->isNuovo())
{{$pre->genere['str0']}} {{$pre->genere['str5']}} si impegna a prestare, in favore dell'Università degli Studi di Urbino Carlo Bo, 
la propria opera intellettuale quale professore a contratto dell'insegnamento di alta qualificazione {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}}, 
per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}, comprensivo della sessione straordinaria d'esame.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@else
<!--RINNOVO-->
{{$pre->genere['str0']}} {{$pre->genere['str5']}} a seguito di {{$pre->rinnovo['text_rinnovo_3']}} del contratto 
di insegnamento {{$pre->rinnovo['text_rinnovo_4']}} per il precedente anno accademico, si impegna a prestare, 
in favore dell'Università degli Studi di Urbino Carlo Bo, la propria opera intellettuale quale professore a contratto 
dell'insegnamento di alta qualificazione di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di 
laurea in {{$pre->cdl}} nel {{$pre->dipartimento}} per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}, comprensivo della sessione straordinaria d'esame.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@endif
</p>
@elseif ($pre->isDidatticaUfficiale())
<!-- CONTRATTO DIDATTICA UFFICIALE NUOVA -->
<p class="normal">
@if($pre->isNuovo())
{{$pre->genere['str0']}} {{$pre->genere['str5']}} si impegna a prestare, in favore dell'Università degli Studi di Urbino Carlo Bo, 
la propria opera intellettuale quale professore a contratto dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}}, 
per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}, comprensivo della sessione straordinaria d'esame.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@else 
<!--RINNOVO-->
{{$pre->genere['str0']}} {{$pre->genere['str5']}}, a seguito di {{$pre->rinnovo['text_rinnovo_3']}} del contratto 
di insegnamento {{$pre->rinnovo['text_rinnovo_4']}} per il precedente anno accademico, si impegna a prestare, 
in favore dell'Università degli Studi di Urbino Carlo Bo, la propria opera intellettuale quale professore a contratto 
dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->cfu}} corso di 
laurea in {{$pre->cdl}} nel {{$pre->dipartimento}} per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}, 
comprensivo della sessione straordinaria d'esame.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@endif
</p>
@elseif ($pre->isDidatticaIntegrativa())
<!-- // CONTRATTO DIDATTICA INTEGRATIVA NUOVO   -->
<p class="normal">
@if($pre->isNuovo())
{{$pre->genere['str0']}} {{$pre->genere['str5']}} si impegna a prestare, in favore dell'Università degli Studi di Urbino Carlo Bo, 
la propria opera intellettuale quale professore a contratto per lo svolgimento del corso integrativo dell'insegnamento ufficiale 
di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}}, per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}.<br>
Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@else 
<!-- RINNOVO -->
{{$pre->genere['str0']}} {{$pre->genere['str5']}} a seguito di {{$pre->rinnovo['text_rinnovo_3']}} del contratto di 
insegnamento {{$pre->rinnovo['text_rinnovo_4']}} per il precedente anno accademico, si impegna a prestare, in favore 
dell'Università degli Studi di Urbino Carlo Bo, la propria opera intellettuale quale professore a contratto per lo svolgimento 
del corso integrativo dell'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}} per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@endif
</p>
@elseif ($pre->isSupportoDidattica())
<!-- CONTRATTO DI SUPPORTO ALLA DIDATTICA NUOVA ATTRIBUZIONE -->
<p class="normal">
@if($pre->isNuovo())
{{$pre->genere['str0']}} {{$pre->genere['str5']}} si impegna a prestare, in favore dell'Università degli Studi di Urbino Carlo Bo, 
la propria opera intellettuale quale professore a contratto per lo svolgimento di attività di supporto alla didattica 
all'insegnamento ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}}, per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@else 
<!-- RINNOVO -->
{{$pre->genere['str0']}} {{$pre->genere['str5']}} a seguito di {{$pre->rinnovo['text_rinnovo_3']}} del contratto di 
insegnamento {{$pre->rinnovo['text_rinnovo_4']}} per il precedente anno accademico, si impegna a prestare, in favore dell'Università degli Studi di 
Urbino Carlo Bo, la propria opera intellettuale quale professore a contratto per lo svolgimento di attività di supporto alla didattica all'insegnamento 
ufficiale di {{$pre->insegnamentoDescr}}{{$pre->settore}}, {{$pre->ore}} ore, 
corso di laurea in {{$pre->cdl}} nel {{$pre->dipartimento}} per l'anno accademico {{$pre->aa}}, {{$pre->periodo}}.
<br>Il presente contratto, eventualmente rinnovabile, non può protrarsi oltre il periodo sopraindicato.
@endif
</p>
@endif
