<h4>Art. 3 - Trattamento dati</h4>
<p class="normal">
Per quanto attiene al trattamento dei dati personali, viene allegata al presente contratto, 
di cui costituisce parte integrante, l'informativa ai sensi dell'art. 13 del Regolamento UE 2016/679.<br>Ai sensi di quanto sopra, 
i dati personali acquisiti verranno trattati con modalità manuale, cartacea e informatica, per le finalità connesse al rapporto 
contrattuale instaurato con l'Ateneo. Il conferimento dei dati è obbligatorio per la gestione del rapporto contrattuale.
</p>

<h4>Art. 4 - Trattamento fiscale previdenziale e assicurativo</h4>
@if($pre->naturaRapporto == "COCOCO")
{{-- // COLLABORAZIONE DI NATURA AUTONOMA --}}
<p class="normal">
Il presente contratto è assoggettato all'Imposta Regionale sulle Attività Produttive (IRAP) ai sensi del D.Lgs. 15/12/1997 n. 446 e ss.mm..<br>
{{$pre->genere['str0']}} {{$pre->genere['str5']}} è soggett{{$pre->genere['str2']}} alle disposizioni di cui all'art. 2, commi 26 e seguenti, 
della Legge 08/08/1995, n. 335 e ss.mm. e ii. (iscrizione alla Gestione Separata presso l'INPS).<br>
@if($pre->d2inail->posizione_previdenziale == '__NOINAIL')    
{{$pre->genere['str0']}} {{$pre->genere['str5']}} è attratt{{$pre->genere['str2']}} all'obbligo assicurativo INAIL in quanto soggetto individuato 
nell'art. 50, comma 1 lettera c-bis del TUIR che esercita un'attività a rischio (art. 1 del Testo Unico n. 1124/65).<br>           
L'Università provvede alla copertura assicurativa privata contro gli infortuni e la responsabilità civile verso terzi con imputazione di spesa 
a carico del bilancio universitario.
@endif
</p>
@elseif($pre->naturaRapporto == "PRPR")
{{-- // PRESTAZIONE PROFESSIONALE (PARTITA IVA) --}}
<p class="normal">
Al presente contratto si applica, in materia fiscale, la disciplina prevista per i rapporti di lavoro autonomo.<br>
La presente prestazione è soggetta ad IVA ai sensi dell'art. 5, primo comma, del D.P.R. n. 633/1972.<br>Il presente contratto non dà luogo 
a trattamento assistenziale e previdenziale.<br>L'Università provvede alla copertura assicurativa privata contro gli infortuni e la responsabilità 
civile verso terzi con imputazione di spesa a carico del bilancio universitario.
</p>
@elseif($pre->naturaRapporto == "PLAO")
{{-- // PRESTAZIONE DI LAVORO AUTONOMO OCCASIONALE --}}
<p class="normal">
Il presente contratto è assoggettato all'Imposta Regionale sulle Attività Produttive (IRAP) ai sensi del D.Lgs. 15/12/1997 n. 446 e ss.mm..<br>
Il presente contratto non dà luogo a trattamento assistenziale e previdenziale.<br>L'Università provvede alla copertura assicurativa privata contro 
gli infortuni e la responsabilità civile verso terzi con imputazione di spesa a carico del bilancio universitario.
</p>
@elseif($pre->naturaRapporto == "PTG")
{{-- // PRESTAZIONE A TITOLO GRATUITO --}}
<p class="normal">
Il presente contratto non dà luogo a trattamento assistenziale e previdenziale.<br>
L'Università provvede alla copertura assicurativa privata contro gli infortuni e la responsabilità civile verso terzi con imputazione di spesa 
a carico del bilancio universitario.
</p>
@elseif($pre->naturaRapporto == "ALD")
{{-- // ASSIMILATO A LAVORO DIPENDENTE --}}
{{-- $datiAnagrafici = utf8_decode($datiAnagrafici." attualmente {{$pre->ruolo}} di questo Ateneo, --}}
<p class="normal">
Considerato che {{$pre->genere['str1']}} {{$pre->genere['str5']}} è attualmente {{$pre->ruolo}} di questo Ateneo, 
il presente contratto sarà trattato, dal punto di vista fiscale, previdenziale e di quiescenza, come reddito da lavoro dipendente.<br>
L'Università provvede alla copertura assicurativa privata contro gli infortuni e la responsabilità civile verso terzi con imputazione 
di spesa a carico del bilancio universitario.
</p>
@endif