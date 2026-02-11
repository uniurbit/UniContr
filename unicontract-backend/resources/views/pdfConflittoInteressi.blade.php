<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
	<style type="text/css">
	  html, body, p, ul, li, span, img {
        margin: 0px;
        padding: 0px;
      }
      body {
		font-family: 'timesnewroman', 'Times New Roman', Times, serif;
		font-size: 10pt;
		text-rendering: geometricPrecision;
      }   
	  h3 {
		  text-align: center
	  }	  
	  .normal {
		font-family: 'Times New Roman', Times, serif;
		font-size: 11pt;		
        text-rendering: geometricPrecision;
 		line-height: 1.5;
		text-align: justify
	  }
	  .piepagina{		
		font-size: 8pt;
		font-style: italic;
		font-family: Arial, Helvetica, sans-serif;
		text-rendering: geometricPrecision;
		text-align: justify;					
	  }
	</style>
</head>
<body>
	<h3>Dichiarazione ai sensi dell'art. 15, comma 1, lett. c, del D.Lgs. n. 33/2013 e s.m.i.</h3>
	<p class="normal">		
		@if($pre->anagrafica->sesso == 'M')
			Il sottoscritto 
		@else
			La sottoscritta							
		@endif		
	{{ $pre->user->nameTutorString() }} {{ $pre->anagrafica->datiAnagraficaString() }}, C.F.
	{{ $pre->user->cf }}, in relazione all'incarico conferito con {{ $pre->insegnamento->deliberaString() }}
	 dell'Università degli Studi di Urbino
	Carlo Bo, consapevole delle sanzioni penali previste dall'art. 76 del D.P.R. 445/2000, per le ipotesi
	di falsità in atti e di dichiarazioni mendaci ivi indicate, ai sensi e per gli effetti del citato D.P.R. n.
	445/2000, e di quanto disposto dall'art. 15, comma 1, lettera c, del D.Lgs 33/2013 e s.m.i., sotto la
	propria responsabilità</p>	

	<h3>DICHIARA</h3>

	@if ($pre->conflittointeressi &&  $pre->conflittointeressi->cariche && count($pre->conflittointeressi->cariche) > 0)
		<p class="normal">- di rivestire le seguenti cariche in enti di diritto privato regolati o finanziati dalla P.A.</p>
		@foreach ($pre->conflittointeressi->cariche as $carica)
		<p class="normal">
		Ente: {{ $carica->ente }} <br>
		Tipologia della carica: {{ $carica->carica }} <br>
		Oggetto: {{ $carica->oggetto }} <br>
		Periodo: dal giorno {{ $carica->dal_giorno }} al giorno {{ $carica->al_giorno }} <br>
		@if( $carica->compenso)
		Compenso lordo annuo: € {{ $carica->compenso }} <br>		
	@endif
		</p>
		<br>
		@endforeach	
	@else 
		<p class="normal">- di non rivestire cariche in enti di diritto privato regolati o finanziati dalla P.A.</p>
	@endif

	@if ($pre->conflittointeressi && $pre->conflittointeressi->incarichi && count($pre->conflittointeressi->incarichi) > 0)
		<p class="normal">- di svolgere i seguenti incarichi in enti di diritto privato regolati o finanziati dalla P.A. </p>
	@foreach ($pre->conflittointeressi->incarichi as $incarico)
		<p class="normal">
		Ente: {{ $incarico->ente }} <br>
		Tipologia dell'incarico: {{ $incarico->carica }} <br>
		Oggetto: {{ $incarico->oggetto }} <br>
		Periodo: dal giorno {{ $incarico->dal_giorno }} al giorno {{ $incarico->al_giorno }} <br>
		@if ($incarico->compenso)
		Compenso lordo annuo: € {{ $incarico->compenso }} <br>	
		@endif	
		</p>
		<br>		
	@endforeach	
	@else 
		<p class="normal">- di non svolgere incarichi in enti di diritto privato regolati o finanziati dalla P.A.</p>
	@endif

	@if($pre->conflittointeressi && $pre->conflittointeressi->flag_attivita)
        <p class="normal"> - di svolgere la seguente attività professionale: {{ $pre->conflittointeressi->descr_attivita }}.
	@else 
      	<p class="normal"> - di non svolgere attività professionale. </p>
	@endif
	
	<br>
	<br>

	<p class="normal">		
		@if($pre->anagrafica->sesso == 'M') Il sottoscritto @else La sottoscritta @endif	
		dichiara altresì: 
	</p>	
	<p class="normal">
		- di essere 
		@if($pre->anagrafica->sesso == 'M')	informato @else informata @endif
		che l'Università degli Studi di Urbino Carlo Bo è titolare del trattamento dei dati personali conferiti 
		e che il trattamento stesso sarà effettuato, nel rispetto del Regolamento UE 679/2016, ai fini dell'assolvimento 
		degli obblighi di pubblicazione di cui all'art. 15 del D.Lgs. n. 33/2013 e s.m.i.; <br>
		- di essere a conoscenza che 
		la presente dichiarazione o i dati in essa contenuti saranno pubblicati sul sito web istituzionale, nella sezione 
		Amministrazione trasparente, ai sensi dell'art. 15, comma l, lett. c, del D.Lgs. n. 33/2013 e s.m.i., 
		dove rimarranno pubblicati per i tre anni successivi alla cessazione dell'incarico, 
		saranno indicizzabili dai motori di ricerca e visibili, consultabili e scaricabili da chiunque. 
	</p> 
	<br>
	<p class="normal">
		@if($pre->anagrafica->sesso == 'M') Il sottoscritto,
		@else La sottoscritta,
		@endif inoltre, si impegna a 
		comunicare tempestivamente eventuali variazioni del contenuto della presente dichiarazione.
	</p>

	<br>

	<p class="normal">
	Urbino, {{ $pre->conflittointeressi->updated_at ? $pre->conflittointeressi->updated_at->format('d/m/Y') : $pre->validazioni->dateSubmitToPrint()}} <br>
	In fede, f.to {{ $pre->user->nameTutorString() }}
	</p>

</body>
</html>