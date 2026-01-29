<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	  
  <link href="{{ public_path('css\\contratto_styles.css') }}" rel="stylesheet" type="text/css">
	<style type="text/css">
    @page {                   
        header: html_myHeader1;         
        footer: html_myFooter1; 
        margin-header: 1.25cm;
        margin-top: 55mm;
        /*margin-top: 2.54cm;*/
        margin-bottom: 2.54cm;
        margin-left: 3.175cm;
        margin-right: 3.175cm;
    } 

    @page informativa {   
      header: html_myHeader2;
      margin-top: 0cm;
      margin-bottom: 2cm;
      margin-left: 2cm;
      margin-right: 2cm;
    }

    div.onitsside {
      page: informativa;    
    }


	</style>
</head>
<body>
  
  <bookmark content="Contratto" level="0" />

  <htmlpageheader name="myHeader2">  
  </htmlpageheader>

  <htmlpageheader name="myHeader1">
    {{-- <img src="{{public_path('img\\logo_info.jpg')}}" style="height: 80px; margin-top: 7px;"/>      --}}
    <div style="position: absolute; top:0; right:0;">
    <img src="file:///{{public_path('img\\logo_uniurb_intestazione_2.jpg')}}" alt="logo uniurb" style="width: 21cm; height: auto;"/>
    </div>
  </htmlpageheader>

  <htmlpagefooter name="myFooter1">
    <div style="text-align: right; padding-bottom: 30px">{PAGENO}</div>   
  </htmlpagefooter>
  
  <div class="lastpage">
  
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
    <div style="page-break-inside:avoid">   
    @include( 'contratto.articoli.art1', $pre)		
    </div> 	
    @include( 'contratto.articoli.art2', $pre)	
    @include( 'contratto.articoli.art3-4', $pre)	
    @include( 'contratto.articoli.art5', $pre)	
    @include( 'contratto.articoli.art6-7-8-9', $pre)	

    <div style="page-break-inside:avoid">   
    @if($pre->isDidatticaIntegrativa())
    <h4>Art. 8 - Accettazione</h4>
    {{-- $art8 --}}
    <p class="normal">
    Il presente contratto viene redatto e sottoscritto esclusivamente in modalità telematica.<br>Le parti convengono che 
    ogni modifica o integrazione al presente contratto dovrà necessariamente prevedere la stessa modalità.
    </p>
    @else
    <h4>Art. 9 - Accettazione</h4>
    {{-- $art9 --}}
    <p class="normal">
    Il presente contratto viene redatto e sottoscritto esclusivamente in modalità telematica.<br>Le parti convengono che 
    ogni modifica o integrazione al presente contratto dovrà necessariamente prevedere la stessa modalità.
    </p>
    @endif
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
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAABoCAIAAAB9kIuNAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV/Tav2oONhBxCFDdbKLFnEsVSyChdJWaNXB5NIvaNKQpLg4Cq4FBz8Wqw4uzro6uAqC4AeIq4uToouU+L+00CLGg+N+vLv3uHsHCI0KU01fFFA1y0jFY2I2tyr6X9EPHwbRi4jETD2RXszAdXzdw8PXuzDPcj/35xhS8iYDPCJxlOmGRbxBPLtp6Zz3iYOsJCnE58RTBl2Q+JHrcovfOBcdFnhm0Mik5omDxGKxi+UuZiVDJY4QhxRVo3wh22KF8xZntVJj7XvyFwby2kqa6zTHEccSEkhChIwayqjAQphWjRQTKdqPufjHHH+SXDK5ymDkWEAVKiTHD/4Hv7s1CzPTraRADOh5se2PCcC/CzTrtv19bNvNE8D7DFxpHX+1Acx9kl7vaKEjYHgbuLjuaPIecLkDjD7pkiE5kpemUCgA72f0TTlg5BYYWGv11t7H6QOQoa6Wb4CDQ2CySNnrLu/u6+7t3zPt/n4Ah9dyr47mXvwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQfnCQQLCQ5/yA0TAAAA2UlEQVR42u3SQQ0AAAjEMMC/5+OLBZJWwrJOUvDZSICJwcRgYkwMJgYTg4kxMZgYTAwmxsRgYjAxmBgTg4nBxGBiTAwmBhODiTExmBhMDCbGxGBiMDGYGBODicHEYGJMDCYGE4OJMTGYGEwMJsbEYGIwMZgYE4OJwcRgYkwMJgYTg4kxMZgYTAwmxsRgYjAxmBgTg4nBxGBiTAwmBhODiTExmBhMDCbGxGBiMDGYGBODicHEYGJMDCYGE4OJMTGYGEwMJsbEYGIwMZgYE4OJwcRgYkwMJgYTw7UOkwPNFPSfiwAAAABJRU5ErkJggg==">                        
    {{-- <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOMAAACECAYAAABif5yuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAGgSURBVHhe7dMxAYAwEMDABx0d698ZGmDBQzPcLVGQ61n7HeC4+y9wmBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjBBhRogwI0SYESLMCBFmhAgzQoQZIcKMEGFGiDAjRJgRIswIEWaECDNChBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjBBhRogwI0SYESLMCBFmhAgzQoQZIcKMEGFGiDAjRJgRIswIEWaECDNChBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjBBhRogwI0SYESLMCBFmhAgzQoQZIcKMEGFGiDAjRJgRIswIEWaECDNChBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjBBhRogwI0SYESLMCBFmhAgzQoQZIcKMEGFGiDAjRJgRIswIEWaECDNChBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjBBhRogwI0SYESLMCBFmhAgzQoQZIcKMEGFGiDAjRJgRIswIEWaECDNChBkhwowQYUaIMCNEmBEizAgRZoQIM0KEGSHCjJAw8wG8ygM01E6mjAAAAABJRU5ErkJggg==">                         --}}
    </div>
    </div>    
    {{-- INFORMATIVA SULLA PRIVACY --}}   
     {{-- <div class="onitsside" >
      @include( 'contratto.informativa', $pre)	    
    </div> --}}
</body>
</html>
