<h4>Art. 5 - Trattamento economico</h4>
@if($pre->naturaRapporto == "COCOCO")
{{-- // COLLABORAZIONE DI NATURA AUTONOMA --}}
<p class="normal">
Il corrispettivo onnicomprensivo lordo per la prestazione è commisurato in € {{$pre->compenso}} e verrà 
versato {{$pre->genere['str4']}} {{$pre->genere['str5']}} in {{$pre->modPagamento}} {{$pre->attestazione}}.<br>La spesa relativa dovrà essere imputata alle relative voci di 
costo del budget autorizzatorio del {{$pre->dipartimento}}, per l'esercizio finanziario di competenza (anno accademico {{$pre->aa}}).<br>
Il corrispettivo suddetto è escluso dal campo di applicazione dell'I.V.A. ai sensi e per gli effetti dell'art. 5, comma 2, del D.P.R. 26/10/1972 n. 633 e ss.mm..
</p>
@elseif($pre->naturaRapporto == "PRPR")
{{-- // PRESTAZIONE PROFESSIONALE (PARTITA IVA) --}}
<p class="normal">
Il corrispettivo onnicomprensivo lordo per la prestazione è commisurato in € {{$pre->compenso}} + IVA 
{{$pre->cassa}} {{$pre->rivalsa}} e verrà versato {{$pre->genere['str4']}} {{$pre->genere['str5']}} in un'unica soluzione al termine del contratto, 
dietro presentazione di regolare fattura {{$pre->attestazione}}.<br>La spesa relativa dovrà essere imputata alle relative voci di costo del 
budget autorizzatorio del {{$pre->dipartimento}}, per l'esercizio finanziario di competenza (anno accademico {{$pre->aa}}).
</p>
@elseif($pre->naturaRapporto == "PLAO")
{{-- // PRESTAZIONE DI LAVORO AUTONOMO OCCASIONALE --}}
<p class="normal">
Il corrispettivo onnicomprensivo lordo per la prestazione è commisurato in € {{$pre->compenso}} e verrà 
versato {{$pre->genere['str4']}} {{$pre->genere['str5']}} in un'unica soluzione al termine del contratto {{$pre->attestazione}}.<br>La spesa 
relativa dovrà essere imputata alle relative voci di costo del budget autorizzatorio del {{$pre->dipartimento}}, per l'esercizio finanziario 
di competenza (anno accademico {{$pre->aa}}).<br>Il corrispettivo suddetto è escluso dal campo di applicazione dell'I.V.A. ai sensi e per 
gli effetti dell'art. 5, comma 2, del D.P.R. 26/10/1972 n. 633 e ss.mm..
</p>
@elseif($pre->naturaRapporto == "PTG")
{{-- // PRESTAZIONE A TITOLO GRATUITO --}}
<p class="normal">
Il presente contratto è a titolo gratuito, come previsto dall'art. 4, co. 2, del Regolamento d'Ateneo per il conferimento di 
incarichi di insegnamento, emanato con D.R. 359/2017 del 25/07/2017, ai sensi della Legge 30/12/2010, n. 240.
</p>
@elseif($pre->naturaRapporto == "ALD")
{{-- // ASSIMILATO A LAVORO DIPENDENTE --}}
<p class="normal">
Il corrispettivo onnicomprensivo lordo per la prestazione è commisurato in € {{$pre->compenso}} e verrà 
versato {{$pre->genere['str4']}} {{$pre->genere['str5']}} in {{$pre->modPagamento}} {{$pre->attestazione}}.<br>La spesa relativa dovrà essere 
imputata alle relative voci di costo del budget autorizzatorio del {{$pre->dipartimento}}, per l'esercizio finanziario di 
competenza (anno accademico {{$pre->aa}}).<br>Il corrispettivo suddetto è escluso dal campo di applicazione dell'I.V.A. ai sensi e per 
gli effetti dell'art. 5, comma 2, del D.P.R. 26/10/1972 n. 633 e ss.mm..
</p>
@endif