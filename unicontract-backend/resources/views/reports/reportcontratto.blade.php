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
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        line-height: 1.7;		                                  
        text-rendering: geometricPrecision;
    } 
    
    h2, h3, h4 { line-height: 100% }

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
        font-size: 12pt;		
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
      font-size: 10pt;		
      font-family: Arial, Helvetica, sans-serif;		
      text-align: left;					
    }       
    
    th {
      text-align: left;
      height: 50px;
      font-style: normal;   
      font-weight: normal;   
    }
    th, td {
      border-bottom: 1px solid #ddd;
    }

	</style>
</head>
<body>
  
  
  <div class="page">
  
  <h4>CONTRATTO DI INSEGNAMENTO A.A. {{ $pre->aa }} 
  <br>MODULO DEI DATI TRIBUTARI, PREVIDENZIALI E FISCALI</h4>    

  <p class="normal">
    Nominativo: {{ $pre->user->nameTutorString() }}<br>
    Insegnamento: {{ $pre->insegnamentoDescr }}<br>
    Corso di Laurea: {{$pre->cdl}}<br>
    Anno Accademico: {{$pre->aa}}<br>
    Tipologia: {{$pre->insegnamento->tipoContrattoToString()}}<br>
    Conferimento: {{$pre->insegnamento->tipoConferimentoToString()}}<br>
  </p>
  <hr>   
  <p class="normal">
    <b>DATI DELL'INSEGNAMENTO</b><br>
    S.S.D.: {{$pre->insegnamento->cod_settore}} - {{ $pre->settore }}<br>
    CFU: {{ $pre->insegnamento->cfu }}<br>
    Ore: {{ $pre->ore }}<br>
    Periodo: {{ $pre->periodo }}<br>
    Compenso lordo: € {{ $pre->compenso }} <br>
    Dipartimento: {{ $pre->dipartimento }}<br>
  </p>    

  <h4>PARTE 2: POSIZIONE DEL COLLABORATORE</h4>  
  <p class="normal">
    {{$pre->p2naturarapporto->rsuToString()}}<br>
    {{$pre->p2naturarapporto->dpaToString()}} <br>
    {{$pre->p2naturarapporto->tpToString()}} <br>
    Natura del rapporto: {{$pre->p2naturarapporto->naturaRapportoToString()}} <br>
  </p>
  </div>
  <div class="page">
  <h4>QUADRO A.1: DATI ANAGRAFICI</h4>  
  <p class="normal">
    Cognome e nome: {{$pre->user->cognome}} {{$pre->user->nome}}<br>
    Luogo di nascita: {{$pre->anagrafica->comune_nascita}} ({{$pre->anagrafica->provincia_nascita}})<br>
    Data di nascita: {{$pre->anagrafica->dataNascitaContr}}<br>
    Codice fiscale: {{$pre->user->cf}}<br>
    @if($pre->anagrafica->cf_coniuge)
    Codice fiscale coniuge: {{$pre->anagrafica->cf_coniuge}}<br>
    @endif
    Cittadinanza: {{$pre->anagrafica->nazione_residenza}}    <br>
    Stato civile: {{$pre->anagrafica->statoCivileToString()}}   <br> 
    {{-- if($naz_res != "IT") {
      $naz_res = "\nTipo di documento: ".$tipo_doc."\nNumero: ".$num_doc."\nMotivo permesso di soggiorno: ".$motivo."\nScadenza: ".$scad;
    } else {
        $naz_res = "";
    } --}}
    Titolo di studio: {{ __('global.'.$pre->anagrafica->titolo_studio ) }}<br>
    Residenza:  {{$pre->anagrafica->datiResidenzaReport()}}<br>
    @if($pre->anagrafica->datiDomicilioFiscaleReport())
    Domicilio fiscale: {{$pre->anagrafica->datiDomicilioFiscaleReport()}} <br>            
    @endif
    <hr>
    <b>RECAPITI</b><br>
    Telefono di riferimento: {{$pre->anagrafica->telefono_cellulare}}  <br>
    @if($pre->anagrafica->telefono_abitazione)
    Telefono abitazione: {{$pre->anagrafica->telefono_abitazione}}  <br>
    @endif
    Email: {{$pre->user->email}} <br>      
    @if($pre->anagrafica->email_privata)
    Email privata: {{$pre->anagrafica->email_privata}} <br>   
    @endif
  </p>

  <h4>QUADRO A.2: DATI BANCARI</h4>  
  <p class="normal">
   @if($pre->a2modalitapagamento)
   @if($pre->a2modalitapagamento->modality == 'AGBM') 
      Modalità di pagamento: RITIRO DEL CORRISPETTIVO PRESSO QUALSIASI AGENZIA UBI BANCA <br>   
   @elseif($pre->a2modalitapagamento->modality == 'ACNT')
      Modalità di pagamento: SPEDIZIONE DI ASSEGNO CIRCOLARE NON TRASFERIBILE ALL'INDIRIZZO DI RESIDENZA <br>   
   @elseif($pre->a2modalitapagamento->modality == 'ACIC') 
      Modalità di pagamento: ACCREDITAMENTO PRESSO ISTITUTO DI CREDITO <br>   
   @endif
      
   @if($pre->a2modalitapagamento->tipologia_conto_corrente ==  'CC' || $pre->a2modalitapagamento->tipologia_conto_corrente == 'CB') 
      Tipologia: CONTO CORRENTE BANCARIO <br>   
   @elseif($pre->a2modalitapagamento->tipologia_conto_corrente == 'BP' || $pre->a2modalitapagamento->tipologia_conto_corrente == 'CP') 
      Tipologia: CONTO BANCO POSTA <br>   
   @endif
   
   IBAN: {{$pre->a2modalitapagamento->iban}} <br> 

   @if($pre->a2modalitapagamento->bic != "")
      Codice SWIFT o BIC: {{$pre->a2modalitapagamento->bic}} <br> 
   @endif
   
   @if($pre->a2modalitapagamento->aba != ""){
      Codice ABA / Routing number {{$pre->a2modalitapagamento->aba}} <br> 
   @endif
      
   Banca: {{$pre->a2modalitapagamento->denominazione}} <br> 
   @if($pre->a2modalitapagamento->luogo)
   Indirizzo agenzia: {{$pre->a2modalitapagamento->luogo}} <br> 
   @endif

   Intestazione C/C: {{$pre->a2modalitapagamento->intestazione}} <br> 
   @endif
  </p>
  </div>

  <div class="page">
  @if($pre->p2naturarapporto->flag_rapp_studio_univ == 1 && $pre->b3rapportoUniv()->first()!=null) 
    @include('reports.b3report', $pre)		 	
  @endif

  @if($pre->p2naturarapporto->flag_dipend_pubbl_amm == 1 && $pre->b4rapportopa()->first()!=null) 
    @include('reports.b4report', $pre)		 	
  @endif

  @if($pre->p2naturarapporto->flag_titolare_pensione == 1 && $pre->b5statopensionamento()->first()!=null) 
    @include('reports.b5report', $pre)		 	
  @endif
  </div>

  <div class="page">
  @if ($pre->p2naturarapporto->natura_rapporto == 'PRPR' && $pre->cPrestazioneProfessionale()->get()->first()!=null)
    @include('reports.creport', $pre)		 	
  @endif
  </div>

  <div class="page">
    @if ($pre->p2naturarapporto->natura_rapporto == 'COCOCO')
      @include('reports.dreport', $pre)		 	
    @endif
    </div>

  <div class="page">
  @if ($pre->p2naturarapporto->natura_rapporto == 'PLAO' && $pre->eAutonomoOcasionale()->get()->first()!=null)
    @include('reports.ereport', $pre)		 	
  @endif
  </div>
  

</body>
</html>
