@if($pre->isDidatticaIntegrativa())
<h4>Art. 6 - Norma di rinvio</h4>
{{-- $art6_occasionale --}}
<p class="normal">
Per quanto non espressamente previsto dal presente contratto, le parti rinviano a quanto disposto dagli artt. 2222 e ss. del Codice Civile e 
dal Regolamento citato in premessa e alla normativa vigente in materia.<br>In caso di inadempimento, anche se dovuto a causa di forza maggiore, 
si applicano le disposizioni contenute nel Libro IV, Titolo II, Capo XIV del Codice Civile.    
</p>        
<h4>Art. 7 - Registrazione</h4>
{{-- $art8 --}}
<p class="normal">
Il presente contratto è sottoposto a registrazione solo in caso d'uso per iniziativa e spesa della parte che vi ha interesse 
ed è esente dall'imposta di bollo in modo assoluto a norma dell'art. 25 della Tabella allegato B al D.P.R. n. 642/72. 
</p>        
<h4>Art. 8 - Accettazione</h4>
{{-- $art9 --}}
<p class="normal">
Il presente contratto viene redatto e sottoscritto esclusivamente in modalità telematica.<br>Le parti convengono che 
ogni modifica o integrazione al presente contratto dovrà necessariamente prevedere la stessa modalità.
</p>
@else
<h4>Art. 6 - Attivazione corso estivo</h4>
{{-- $art6 --}}
<p class="normal">
Qualora la struttura didattica decida per l'anno accademico di cui all'art. 1 di attivare il corso estivo relativo 
all'insegnamento oggetto del presente contratto, lo stesso sarà affidato, con apposita nota di incarico predisposta dal 
Dipartimento interessato, {{$pre->genere['str4']}} {{$pre->genere['str5']}} con definizione del numero delle ore e del relativo compenso a cura del Dipartimento stesso, 
previa accettazione del docente.
</p>
<h4>Art. 7 - Norma di rinvio</h4>
{{-- $art7 --}}
<p class="normal">
Per quanto non espressamente previsto dal presente contratto, le parti rinviano a quanto disposto dal Regolamento citato in premessa 
e alla normativa vigente in materia. In caso di inadempimento, anche se dovuto a causa di forza maggiore, si applicano le disposizioni 
contenute nel Libro IV, Titolo II, Capo XIV del Codice Civile.
</p>
<h4>Art. 8 - Registrazione</h4>
{{-- $art8 --}}
<p class="normal">
Il presente contratto è sottoposto a registrazione solo in caso d'uso per iniziativa e spesa della parte che vi ha interesse ed è 
esente dall'imposta di bollo in modo assoluto a norma dell'art. 25 della Tabella allegato B al D.P.R. n. 642/72.
</p>
<h4>Art. 9 - Accettazione</h4>
{{-- $art9 --}}
<p class="normal">
Il presente contratto viene redatto e sottoscritto esclusivamente in modalità telematica.<br>Le parti convengono che ogni modifica o 
integrazione al presente contratto dovrà necessariamente prevedere la stessa modalità.
</p>
@endif
