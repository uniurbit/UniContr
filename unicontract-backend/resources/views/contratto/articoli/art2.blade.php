<h4>Art. 2 - Diritti e doveri del titolare dell'incarico</h4>
<!-- ALTA QUALIFICAZIONE NUOVA ATTRIBUZIONE RINNOVO--> 
<!--CONTRATTO DIDATTICA UFFICIALE NUOVA ATTRIBUZIONE RINNOVO--> 
@if($pre->isAltaQualificazione() || $pre-> isDidatticaUfficiale())
<p class="normal">
Nell'ambito della programmazione didattica definita dai competenti organi, {{$pre->genere['str1']}} {{$pre->genere['str5']}} è tenut{{$pre->genere['str2']}}:
</p>
<p class="normal">
<!--art2_b-->
- al caricamento delle informazioni relative all'insegnamento (quali programma, testi di studio, modalità didattiche, modalità di accertamento, ecc.) 
sull'apposita sezione del portale web d'Ateneo;
</p>
<p class="normal">
<!--art2_d-->
- allo svolgimento delle lezioni ed esercitazioni previste per l'incarico dell'insegnamento conferito; <br>
- all'utilizzo dell'apposita piattaforma digitale per il deposito del materiale didattico e le comunicazioni telematiche con gli studenti;
</p>
<p class="normal">
    <!--art2_d-->
- al ricevimento ed alla assistenza agli studenti, nonché agli ulteriori impegni per l'orientamento, la programmazione, 
l'organizzazione didattica e la verifica dell'apprendimento;
</p>
<p class="normal">
    <!--art2_e-->
- alla tenuta di un registro delle lezioni con la specificazione del loro tema che dovrà essere consegnato al 
responsabile della struttura didattica alla scadenza del termine dell'incarico d'insegnamento;
</p>
<p class="normal">
    <!--art2_f-->
- alla partecipazione alle commissioni per gli esami di profitto e di laurea per l'intero anno accademico, ivi compresa la sessione 
straordinaria, secondo le disposizioni del Regolamento didattico ed il calendario elaborato dalla struttura didattica, 
avvalendosi dell'apposita piattaforma digitale per la verbalizzazione degli esiti degli esami.
</p>
<p class="normal">
    <!--art2_g-->
L'attività, di cui sopra, con coordinamento stabilito di comune accordo tra il Docente e l'Ateneo, 
dovrà essere eseguita personalmente ed in autonomia dallo stesso il quale non potrà avvalersi di sostituti. <!--<br>-->
I docenti a contratto possono accedere alle strutture bibliotecarie e di servizio dell'Ateneo, funzionali all'efficace 
svolgimento delle attività didattiche attribuite e possono valersi del titolo di professore purché l'accompagnino 
con l'indicazione "a contratto" e con la specificazione della materia di insegnamento. <!--<br>-->
Il presente contratto non dà luogo a diritti in ordine all'accesso nei ruoli dell'Università. <!--<br>-->
Lo stesso si intende risolto in caso di violazione, accertata dall'Autorità disciplinare competente, degli obblighi derivanti dal 
Codice di comportamento dei lavoratori dell'Università degli Studi di Urbino Carlo Bo.
</p>
@elseif($pre->isDidatticaIntegrativa() || $pre->isSupportoDidattica())
<p class="normal">
Nell'ambito della programmazione didattica definita dai competenti organi, {{$pre->genere['str1']}} {{$pre->genere['str5']}} è tenut{{$pre->genere['str2']}} allo svolgimento 
della propria attività nel rispetto degli orari, delle forme e dei programmi concordati con il professore ufficiale della materia e partecipa, 
ove nominato cultore della materia, alle commissioni di esame per le discipline ufficiali delle quali svolgono i corsi.<br>L'attività, di cui sopra, 
dovrà essere eseguita personalmente {{$pre->genere['str3']}} {{$pre->genere['str5']}} {{$pre->genere['str1']}} quale non potrà avvalersi di sostituti.<br>
Il presente contratto non dà luogo a diritti in ordine all'accesso nei ruoli dell'Università.<br>Lo stesso si intende risolto in caso di violazione, accertata dall'Autorità disciplinare competente,
degli obblighi derivanti dal Codice di comportamento dei lavoratori dell'Università degli Studi di Urbino Carlo Bo.
</p>
@endif