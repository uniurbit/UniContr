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
      margin-left: 30mm;
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 13pt;		
      text-rendering: geometricPrecision;         
                       
    } 

    .bozza {
      background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='1200px' width='1000px'><text x='700' y='300' fill='#f7d0cd' font-size='150pt' font-family='Arial' transform='rotate(45)'>BOZZA</text></svg>");
      background-repeat: repeat-y; 
      background-position: left center;
      background-attachment: fixed;
      background-size:100%;
    }

	  h4 {
      font-size: 13pt;	    
      text-align: center;
      line-height: 1.7;
      text-rendering: geometricPrecision;
	  }	 
    div.page
    {
        page-break-after: always;
        page-break-inside: avoid;
    } 
	  .normal {
		font-family:  Arial, Helvetica, sans-serif;
		font-size: 13pt;		
    text-rendering: geometricPrecision;
 		line-height: 1.7;
		text-align: justify
	  }
    .small {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 11pt;		
      text-rendering: geometricPrecision;
      line-height: 1.7;
      text-align: left
	  }
    .infor {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 11pt;		
      text-rendering: geometricPrecision;
      line-height: 1.3;
      text-align: justify
	  }
    .subtitleinfor {
      font-family:  Arial, Helvetica, sans-serif;
      font-size: 12pt;
      font-weight: bold;		
      text-rendering: geometricPrecision;
      line-height: 1.5;
      text-align: left
    }
	  .piepagina {		
      font-size: 9pt;		
      font-family: Arial, Helvetica, sans-serif;		
      text-align: left;					
	  }   
	</style>
</head>
<body class="@if ($type=='CONTR_BOZZA') bozza @endif">
  
  
  <div class="page">
  
  <h4>CONTRATTO DI DIRITTO PRIVATO PER ATTIVITÀ DI INSEGNAMENTO 
  <br>AI SENSI DELL'ART. 23, CO. 1, DELLA LEGGE 30/12/2010, N. 240</h4>
    <h4>TRA</h4>
    <p class="normal">
        l'Università degli Studi di Urbino Carlo Bo, codice fiscale n. 82002850418, partita IVA n.
        00448830414, rappresentata legalmente dal Magnifico Rettore Giorgio Calcagnini, 
        nato il 30/09/1956 ad Urbino (PU), domiciliato per la sua carica in Urbino (PU) - Via Saffi n. 2, il
        quale agisce in ottemperanza del Regolamento d'Ateneo per il conferimento di incarichi di
        insegnamento e della Legge 30/12/2010, n. 240,
    </p>
    <h4>E</h4>
	<p class="normal">		
	{{ $pre->user->nameTutorString() }} {{ $pre->datiAnagraficaString() }}, codice fiscale
	{{ $pre->user->cf }} {{ $pre->anagrafica->datiResidenza() }} 
	</p>	
    <h4>PREMESSO E CONSIDERATO</h4>
    <p class="normal">	
        - che il Codice di comportamento dei lavoratori dell'Università degli Studi di Urbino Carlo Bo,
        emanato con D.R. n. 37/2014 del 27/01/2014, è entrato in vigore il 28/01/2014;
    </p>
    <p class="normal">	
        - che con D.R. n. 359/2017 del 25/07/2017 è stato emanato il Regolamento d'Ateneo per il
        conferimento di incarichi di insegnamento ai sensi della Legge 30/12/2010, n. 240 e ss.mm.ii.,
        quale risultante della modifica apportata all'articolo 11 del Regolamento precedentemente
        emanato con D.R. n. 498/2016 del 02/11/2016;
    </p>
        

    @include( 'contratto.premessa.premessaCont', $pre)     
    
    <p class="normal">	
    Ciò premesso e consensualmente assunto come parte integrante del presente contratto
    </p>	 						    
    
    @include( 'contratto.articoli.art1', $pre)		 	
    @include( 'contratto.articoli.art2', $pre)	
    @include( 'contratto.articoli.art3-4', $pre)	
    @include( 'contratto.articoli.art5', $pre)	
    @include( 'contratto.articoli.art6-7-8-9', $pre)	

    <br>
    <p class="small">	
    URBINO, (data ultima sottoscrizione digitale in ordine cronologico attestata dalla marcatura temporale)
    </p>
    <br>
    <p class="normal">	
    Il Rettore Giorgio Calcagnini 
    </p>
    <br>
    <p class="normal">	
    {{$pre->genere['str0']}} {{$pre->genere['str5']}} {{ $pre->user->nameTutorString() }} 
    </p>
    </div>
    {{-- INFORMATIVA SULLA PRIVACY --}}
    <div class="page ">
    <div class="logo" ></div>
        @include( 'contratto.informativa', $pre)	
    </div>
</body>
</html>
