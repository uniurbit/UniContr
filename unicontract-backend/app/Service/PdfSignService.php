<?php

namespace App\Service;

class PdfSignService 
{    
    //esempio di snippet di codice per la firma di un pdf
            // <hashInfo >
        // 4 < hashAlgorithm >SHA -256 </ hashAlgorithm >
        // 5 < startOffset >0</ startOffset >
        // 6 <length >0</ length >
        // 7 <hashValue >52 eb75f8399 .... </ hashValue >
        // 8 </ hashInfo >            
        // $arrayHash = [                
        //     'hashAlgorithm' => 'SHA-256',
        //     'startOffset' => 0,
        //     'length' => 0,
        //     'hashValue' => hash('sha256',  $pdf->output()),//$pdf->getMpdf()->getBuffer()  $pdf->getMpdf()->buffer               
        // ];
        
     /**
	 * Digital signature max length.
	 * @protected
	 * @since 4.6.005 (2009-04-24)
	 */
	protected static $signature_max_length = 35226;

    /**
	 * ByteRange placemark used during digital signature process.
	 * @since 4.6.028 (2009-08-25)
	 * @public static
	 */
	public static $byterange_string = '/ByteRange[0 ********** ********** **********]';

    /**
	 * Returns a temporary filename for caching object on filesystem.
	 * @param string $type Type of file (name of the subdir on the tcpdf cache folder).
	 * @param string $file_id TCPDF file_id.
	 * @return string filename.
	 * @since 4.5.000 (2008-12-31)
	 * @public static
	 */
	public static function getObjFilename($type='tmp', $file_id='') {
		return tempnam(storage_path('tempdir'), '__unipta_'.$file_id.'_'.$type.'_');
	}

    public static function format($date)
	{
		$z = date('O'); // +0200
		$offset = substr($z, 0, 3) . "'" . substr($z, 3, 2) . "'"; // +02'00'
		return date('YmdHis', $date) . $offset;
	}
    
    public static function getObj($objid){
        return $objid.' 0 obj'."\n";
    }

    public static function field_dictionary($out, $objid, $fieldid, $metadataid, $buffer_length, $outputIntentRootId)
    {
         
        $out .= self::getObj($objid);
        $out .= '<<';
        $out .= '/OpenAction[3 0 R/Fit]/PageMode/UseOutlines';
        if ($outputIntentRootId>0){
            $out .= '/OutputIntents ['.$outputIntentRootId.' 0 R]';
        }
        $out .='/PageLayout/OneColumn/Type/Catalog/AcroForm<</SigFlags 3 /Fields['.$fieldid.' 0 R]';   
        $out .= '/DR <</Font <</F1 34 0 R>> >>';
       //aggiornare la con la lettura del obj dei metadati
        $out .= '>> /Pages 1 0 R'.($metadataid>0 ?'/Metadata '.$metadataid.' 0 R' :'');
        $out .= '>>'."\n";
        $out .= 'endobj'."\n";
        $offset_2 = strlen($out)+$buffer_length;

        return  array($offset_2, $out);    
    }

    private static function rect($x, $y, $w, $h, $style = '')
	{
           
		// Draw a rectangle	
		return sprintf('%.3F %.3F %.3F %.3F', $x,  $y, $x+$w, $y+$h);
	}


    private static function widget_dictionary($out, $objid, $sigfirmaid, $obj_page, $img_position, $buffer_length)
    {
        $str = $img_position ? 'Firma' : 'Validazione';

        $out .= self::getObj($objid);
        $out .= '<< /Type /Annot';
        $out .= ' /Subtype /Widget';
        $out .= ' /FT /Sig';
        $out .= $img_position ? ' /Rect[ '.self::rect($img_position[3],$img_position[4],$img_position[1],$img_position[2]).' ] ' :  ' /Rect[0 0 0 0]' ;    //Image width, image height, X, Y
        $out .= ' /V '.($sigfirmaid).' 0 R';
        $out .= ' /T('.$str.')';        
        $out .= ' /F 4';        
        $out .= ' /Ff 0';
        $out .= ' /P '.$obj_page.' 0 R'; // link to signature appearance /P 3 0 R   (3 0 R è l'oggetto)  
        //TODO mettere il riferimento all'immagine di firma e la dimensione del rettangolo a 1 1 
      //  $out .= ' /AP <</N 47 0 R>>';
        $out .= ' >>'."\n";
        $out .= 'endobj'."\n";
        $offset_3 = strlen($out)+$buffer_length;

        return array($offset_3, $out);
    }

    private static function info_override($out,  $objid, $now, $buffer_length)
    {      
        //info       
        $out .= $objid.' 0 obj'."\n";
        $out .= '<<';
        // default producer
        $out .= ' /Producer UniPTA';
        // The date and time the document was created, in human-readable form
        $out .= ' /CreationDate ('.'D:' . $now.')';
        // The date and time the document was most recently modified, in human-readable form
        $out .= ' /ModDate ('.'D:' . $now.')';        
        // A name object indicating whether the document has been modified to include trapping information
        //$out .= ' /Trapped /False';
        $out .= ' >>'."\n";
        $out .= 'endobj'."\n";

        $offset_4 = strlen($out)+$buffer_length;
        return array($offset_4, $out);
    }

    private static function mediabox_override($out, $fieldid, $buffer_length, $obj_page, $pdf)
    {        
        $out .= $obj_page.' 0 obj'."\n"; //'3 0 obj'."\n";
        $out .= '<< /Contents '.($obj_page+1).' 0 R /Type/Page/Resources 2 0 R/Parent 1 0 R /Annots[ '.$fieldid.' 0 R ] /MediaBox[0 0 595.280 841.890]/TrimBox[0.000 0.000 595.280 841.890]';
        //se c'è watermark aggiungere il group
        if ($pdf->getMpdf()->showWatermarkText){
            $out .= ' /Group << /Type /Group /S /Transparency /CS /DeviceRGB >> '; 
        }        
        $out .= ' >>'."\n";
        $out .= 'endobj'."\n";
        $offset_override_3 = strlen($out)+$buffer_length;

        return array($offset_override_3, $out);
    }

    private static function signature_dictionary($out, $objid, $signature_data, $now)
    {
        $out .= $objid.' 0 obj'."\n";
        $out .= ' << /Name ('.$signature_data['info']['Name'].')';
        $out .= ' /Type /Sig /Filter /Adobe.PPKLite';		
        $out .= ' /SubFilter /adbe.pkcs7.detached';     
        $out .= ' /M (D:' . $now.')'; 
        $out .= ' '.Self::$byterange_string;
        $out .= ' /Contents<'.str_repeat('0', Self::$signature_max_length).'>';          
        $out .= ' /Location ('.$signature_data['info']['Location'].')';
        $out .= ' /Reason ('.$signature_data['info']['Reason'].')';
        $out .= ' >>'."\n";
        $out .= 'endobj'."\n";
        return $out;
    }

    /**
     * Decode the Cross-Reference section
     *
     * @param array $xref    Previous xref array (if any).
     * @param array $matches Matches containing traile sections
     *
     * @return array Xref and trailer data.
     */
    protected static function getTrailerData($xref, $matches)
    {
        $trailer_data = $matches[1][0];
        if (!isset($xref['trailer']) || empty($xref['trailer'])) {
            // get only the last updated version
            $xref['trailer'] = array();
            // parse trailer_data
            if (preg_match('/Size[\s]+([0-9]+)/i', $trailer_data, $matches) > 0) {
                $xref['trailer']['size'] = intval($matches[1]);
            }
            if (preg_match('/Root[\s]+([0-9]+)[\s]+([0-9]+)[\s]+R/i', $trailer_data, $matches) > 0) {
                $xref['trailer']['root'] = intval($matches[1]); //.'_'.intval($matches[2]);
            }
            if (preg_match('/Encrypt[\s]+([0-9]+)[\s]+([0-9]+)[\s]+R/i', $trailer_data, $matches) > 0) {
                $xref['trailer']['encrypt'] = intval($matches[1]); //.'_'.intval($matches[2]);
            }
            if (preg_match('/Info[\s]+([0-9]+)[\s]+([0-9]+)[\s]+R/i', $trailer_data, $matches) > 0) {
                $xref['trailer']['info'] = intval($matches[1]); //.'_'.intval($matches[2]);
            }
            if (preg_match('/ID[\s]*[\[][\s]*[<]([^>]*)[>][\s]*[<]([^>]*)[>]/i', $trailer_data, $matches) > 0) {
                $xref['trailer']['id'] = array();
                $xref['trailer']['id'][0] = $matches[1];
                $xref['trailer']['id'][1] = $matches[2];
            }
        }
       
        return $xref;
    }
    
    /**
     * getSignPosition
     *
     * @param  mixed $pdf
     * @return array img_position, img_page_number
     */
    public static function getSignPosition($pdf, $multi=false, $firmaio=true, $search = 'data ultima sottoscrizione digitale in ordine cronologico'){
        $img_position=null;      
        $obj_page = null;
        $page_number = null;
        //nececcaria per la firma digitale
        //$buffer = $pdf->Output();
        // *** apply digital signature to the document ***
        // get the document content
        $pdfdoc = $pdf;
        if (method_exists($pdf,'getMpdf')){
            $pdf->Output();
            $pdfdoc = $pdf->getMpdf()->buffer;
        }
        
        //cerco la pagina dove posizionare la firma
        preg_match("/<<\s*\/Type\s*\/Pages\s*\/Kids\s*\[(.*?)\]\s*\/Count/s", $pdfdoc, $m);
        preg_match_all("/(\d+) 0 R /s", $m[1], $o);
        $objlist = $o[1];

        $result = [];
        foreach ($objlist as $key=>$obj) {			
            preg_match("/" . ($obj + 1) . " 0 obj\n<<\s*\/Filter\s*\/FlateDecode\s*\/Length (\d+)>>\nstream\n(.*?)\nendstream\n/s", $pdfdoc, $m);		
            $s = $m[2];
            if (!$s) {
                continue;
            }	
            $s = gzuncompress($s);
            //if (strpos($string, $word) === FALSE) {
            //|| strpos($s,mb_convert_encoding('DIPENDENTE', 'UTF-16BE', 'UTF-8')) || strpos($s,mb_convert_encoding('DICHIARANTE', 'UTF-16BE', 'UTF-8'))
            if (strpos($s,mb_convert_encoding($search, 'UTF-16BE', 'UTF-8'))  ){
                $candidate = self::findSignatureImageCandidate($s);
                if ($candidate) {
                    //Image width, 0, 0, image height, X, Y
                    //$obiw * Mpdf::SCALE, $obih * Mpdf::SCALE, $objattr['INNER-X'] * Mpdf::SCALE, ($this->h - ($objattr['INNER-Y'] + $obih )) * Mpdf::SCALE,
                    $img_position = $candidate;     
                    $obj_page = $obj;                        
                    $page_number = $key+1;
                    if ($firmaio){
                        array_push($result, PdfSignService::getWidgetPDFSignaturePositionFirmaIO($img_position, $page_number));                            
                    }else{
                        array_push($result, PdfSignService::getWidgetPDFSignaturePosition($img_position, $page_number));
                    }
                    
                    if (!$multi){                            
                        break;
                    }                            
                }                               
            }                 
        }

        if ($page_number == null){
            return null;
        }
        
        //"q 170.250 0 0 99.000 340.489 92.397 cm /I2 Do Q"
        //position={"top":827,"width":267,"fieldname":"","height":161,"page":2,"left":426}
        return $result; //PdfSignService::getWidgetPDFSignaturePosition($img_position, $page_number);
    }
    
    /**
     * getWidgetPDFSignaturePosition
     *
     * @param  mixed $img_position
     * @param  mixed $obj_page
     * @return $attrs posizione firma in formato Firma con IO
     */
    public static function getWidgetPDFSignaturePositionFirmaIO($img_position, $obj_page){
        //Image width, 0, 0, image height, X, Y
        //array img_position 170.25 99.0 90.0 222.511 cm

        //Image width, image height, X, Y
        //pt = px * ( 72pt / 96 )
        // px = pt * 96 / 72 NON CONVERTIRE IN px
        $factor = 1; //96/72;
        $h_pts = 842;
        $y_dallalto = ($h_pts*$factor)-($img_position[4]*$factor)-($img_position[2]*$factor);                
        
        $attrs = [
            "coordinates" => [
                "x" => intval($img_position[3]*$factor),
                "y" => intval($y_dallalto)
            ],
            "size"=>[
                "w" => intval($img_position[1]*$factor), //177
                "h" => intval($img_position[2]*$factor) //80
            ],
            "page" => $obj_page-1 //pagine partono da 0 per FIRMAIO da 1 per U-Sign
        ];
        
        return $attrs;      
    }

        // page|x|y|width|height|ppi 
    // list of value separed by a pipe; 
    // x,y,width,height expressend in pixel ,  ppi expressed in  "pixel per inch" if not set will be used op
    public static function getWidgetPDFSignaturePosition($img_position, $obj_page){
        //Image width, image height, X, Y
        $factor = 96/72;
        $h_pts = 842;
        $y_dallalto = ($h_pts*$factor)-($img_position[4]*$factor)-($img_position[2]*$factor);
        $adapt_px = 50; 
        //page|x|y|width|height|ppi 
        return $obj_page.'|'.intval($img_position[3]*$factor).'|'.(intval($y_dallalto)-$adapt_px).'|'.intval($img_position[1]*$factor).'|'.(intval($img_position[2]*$factor)+$adapt_px).'|96';

    }    


    public static function sign($pdf, $signature_data, $ctr){     
           
        //nececcaria per la firma digitale
        $buffer = $pdf->Output();
        // *** apply digital signature to the document ***
        // get the document content
        $pdfdoc = $pdf->getMpdf()->buffer;

            

        $img_position=null;
        $obj_page=3;

        $find_image = true;
        if ($find_image){
            //cerco la pagina dove posizionare la firma
            preg_match("/<<\s*\/Type\s*\/Pages\s*\/Kids\s*\[(.*?)\]\s*\/Count/s", $pdfdoc, $m);
            preg_match_all("/(\d+) 0 R /s", $m[1], $o);
            $objlist = $o[1];

            foreach ($objlist as $obj) {			
                preg_match("/" . ($obj + 1) . " 0 obj\n<<\s*\/Filter\s*\/FlateDecode\s*\/Length (\d+)>>\nstream\n(.*?)\nendstream\n/s", $pdfdoc, $m);		
                $s = $m[2];
                if (!$s) {
                    continue;
                }	
                $s = gzuncompress($s);
                //if (strpos($string, $word) === FALSE) {
                if (strpos($s,mb_convert_encoding('FIRMA', 'UTF-16BE', 'UTF-8')) || strpos($s,mb_convert_encoding('DIPENDENTE', 'UTF-16BE', 'UTF-8')) ){
                    $candidate = self::findSignatureImageCandidate($s);
                    if ($candidate) {
                        //Image width, 0, 0, image height, X, Y
                        //$obiw * Mpdf::SCALE, $obih * Mpdf::SCALE, $objattr['INNER-X'] * Mpdf::SCALE, ($this->h - ($objattr['INNER-Y'] + $obih )) * Mpdf::SCALE,
                        $img_position = $candidate;     
                        $obj_page = $obj;
                        break;
                    }               
                }                              
            }
        }


        //file_put_contents('page.txt', $pdf->getMpdf()->pages[1]);
      
        $outputIntentRootId = 0; 
        preg_match('/([0-9]+)[\s][0-9]+[\s]obj[\r\n]+<<\/Type \/OutputIntent/i', $pdfdoc, $m);
        if (isset($m[1])) {
            $outputIntentRootId = $m[1]; 
        }

        //$offset=0;
        //preg_match('/([3]+[\s][0-9]+[\s]obj)/i', $pdfdoc, $m, PREG_OFFSET_CAPTURE, $offset);
        //preg_match('/group[\s]*<<(.*)>>/is', $pdfdoc, $matches);
        // read metadata in PDF
        $inforefid = 50; // arbitrary number 
        preg_match('/([0-9]+)[\s][0-9]+[\s]obj[\r\n]+<<\/Title/i', $pdfdoc, $m);
        if (isset($m[1])) {
            $inforefid = $m[1]; //intval(explode(' ',trim($m[1]))[0]); 
        }

        $metadataid = 0;
		preg_match("/Metadata (\d+) 0 R[\r\n]+/s", $pdfdoc, $m);
        if(isset($m[1])){
            $metadataid = $m[1];
        } 
        // Update startxref in PDF
		preg_match("/startxref[\s]*[\r\n]+(\d+)[\s]*[\r\n]+%%EOF/s", $pdfdoc, $m);
		$previous_startxref = $m[1];

        $xref=[];
        // get trailer data
        if (!preg_match('/trailer[\s]*<<(.*)>>/isU', $pdfdoc, $matches, PREG_OFFSET_CAPTURE, $previous_startxref) > 0) {
            throw new PPException('Unable to find trailer');
        }
        $xref = Self::getTrailerData($xref, $matches);        

        //remove last newline
        //$pdfdoc = substr($pdfdoc, 0, -1);        
        $buffer_length = strlen($pdfdoc);

        $objid = $pdf->getMpdf()->currentObjectNumber + 1; //esempio è il 55 
        $startid = $objid;

        $fieldid = $objid+1;
        $out = '%PDF-1.4'."\n";      
        //$out .="%âãÏÓ"."\n";
        $offset_1 = strlen($out)+$buffer_length;
        //catalogo
        $objidcatalog = $objid;
        //dictionary
        list($offset_2, $out) = Self::field_dictionary($out, $objid, $fieldid, $metadataid, $buffer_length, $outputIntentRootId);

        //incremento objid
        ++$objid; 
        //riferimento al dictionary di firma (signature_dictionary)
        $sigfirmaid = $objid + 1;    
        $now = Self::format(time());        
        list($offset_3, $out) = self::widget_dictionary($out, $objid, $sigfirmaid, $obj_page, $img_position, $buffer_length);        
        list($offset_override_3, $out) = self::mediabox_override($out, $fieldid, $buffer_length, $obj_page, $pdf);              

        //cercare objinfo dal pdf
        $objidinfo =  $xref['trailer']['info'];
        list($offset_4, $out) = self::info_override($out, $objidinfo, $now, $buffer_length);
        
        //incremento objid                 
        ++$objid;         
        if (!$sigfirmaid == $objid) {
           
        }     
        //firma 
        $out = self::signature_dictionary($out, $sigfirmaid, $signature_data, $now);
        // startxref
        $startxref = strlen($out)+$buffer_length;
            
        // XREF section
		$out .='xref'."\n";
		$out .= '0 1'."\n";
        $out .= '0000000000 65535 f '."\n";
        $out .= $obj_page.' 1'."\n";
        $out .= sprintf('%010d 00000 n ', $offset_3 )."\n";
        $out .= $objidinfo.' 1'."\n"; //override di alcune info  \creationdate \moddate   
        $out .= sprintf('%010d 00000 n ', $offset_override_3)."\n"; //info
        $out .= $startid.' '.($objid - $startid+1)."\n";
        $out .= sprintf('%010d 00000 n ', $offset_1)."\n"; //bytes from the beginning of the file to the beginning of the object.
        $out .= sprintf('%010d 00000 n ', $offset_2)."\n";        
        $out .= sprintf('%010d 00000 n ', $offset_4)."\n";         
        $out .= 'trailer'."\n";
		$out .= '<<';
		$out .= ' /Size '.($objid + 1);
		$out .= ' /Root '.$objidcatalog.' 0 R';
		$out .= ' /Info '.$objidinfo.' 0 R';
        $out .= ' /ID [<'.$xref['trailer']['id'][0].'> <'.$xref['trailer']['id'][1].'>]';
        $out .= ' /Prev '.$previous_startxref; // previous xref da leggere dal file
        $out .= '>> '."\n";
        //$out .= 'endobj'."\n";
        $out .= 'startxref'."\n";
		$out .= ($startxref)."\n";
        $pdfdoc .= $out;
        $pdfdoc .= '%%EOF';
 
        self::apply_signature($pdfdoc, $ctr, $signature_data, $pdf);
    }

    private static function apply_signature($pdfdoc, $ctr, $signature_data, $pdf)
    {
        // remove filler space
        $byterange_string_len = strlen(Self::$byterange_string);
        
        // <<
        // /Type /Sig
        // /Filter /Adobe.PPKLite
        // /SubFilter /ETSI.CAdES.detached
        // /Name (My Name)
        // /ContactInfo (info@eideasy.com)
        // /Location (At my desk)
        // /Reason (Signed in test app)
        // /M (D:20210105184421+00'00')
        // /Contents <30822C....CFE000....000000>
        // /ByteRange [0 3991 41881 794]                  
        // >>
        // define the ByteRange
        $byte_range = array();
        $byte_range[0] = 0;
        $byte_range[1] = strpos($pdfdoc, Self::$byterange_string) + $byterange_string_len + 10;
        $byte_range[2] = $byte_range[1] + Self::$signature_max_length + 2;
        $byte_range[3] = strlen($pdfdoc) - $byte_range[2];
        $pdfdoc = substr($pdfdoc, 0, $byte_range[1]).substr($pdfdoc, $byte_range[2]);
        // replace the ByteRange
        $byterange = sprintf('/ByteRange[0 %u %u %u]', $byte_range[1], $byte_range[2], $byte_range[3]);
        $byterange .= str_repeat(' ', ($byterange_string_len - strlen($byterange)));
        $pdfdoc = str_replace(Self::$byterange_string, $byterange, $pdfdoc);
        // write the document to a temporary folder
        $tempdoc = Self::getObjFilename('doc', $ctr->id);
        $f = fopen($tempdoc, 'wb');
        if (!$f) {
            abort(500, 'Unable to create temporary file: '.$tempdoc);            
        }
        $pdfdoc_length = strlen($pdfdoc);
        fwrite($f, $pdfdoc, $pdfdoc_length);
        fclose($f);
        // get digital signature via openssl library
        $tempsign = Self::getObjFilename('sig', $ctr->id);
        if (empty($signature_data['extracerts'])) {
            openssl_pkcs7_sign($tempdoc, $tempsign, $signature_data['signcert'], array($signature_data['privkey'], $signature_data['password']), array(), PKCS7_BINARY | PKCS7_DETACHED);
        } else {
            openssl_pkcs7_sign($tempdoc, $tempsign, $signature_data['signcert'], array($signature_data['privkey'], $signature_data['password']), array(), PKCS7_BINARY | PKCS7_DETACHED, $signature_data['extracerts']);
        }
        // read signature
        $signature = file_get_contents($tempsign);
        // extract signature
        $signature = substr($signature, $pdfdoc_length);
        $signature = substr($signature, (strpos($signature, "%%EOF\n\n------") + 13));
        $tmparr = explode("\n\n", $signature);
        $signature = $tmparr[1];
        // decode signature
        $signature = base64_decode(trim($signature));
        // add TSA timestamp to signature
        //$signature = $this->applyTSA($signature);
        // convert signature to hex
        $signature = current(unpack('H*', $signature));
        $signature = str_pad($signature, Self::$signature_max_length, '0');
        // Add signature to the document
        $pdf->getMpdf()->buffer =  substr($pdfdoc, 0, $byte_range[1]).'<'.$signature.'>'.substr($pdfdoc, $byte_range[1]);
        //$pdf->getMpdf()->bufferlen = strlen( $pdf->getMdpf()->buffer);		
        
    }

    public static function findSignatureImageCandidate(string $content): ?array
    {
        // Target dimensions (adjust if needed)
        $targetWidth = 177;
        $targetHeight = 78.0;
        $tolerance = 0.2;  // 10%
        $minY = 40;       // Skip images near the top
        $maxArea = 50000;  // Optional: skip too-large images

        preg_match_all('/q (\d+\.\d+) 0 0 (\d+\.\d+) (\d+\.\d+) (\d+\.\d+) cm \/I(\d+) Do Q/', $content, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            [$full, $w, $h, $x, $y, $id] = $match;

            $w = (float)$w;
            $h = (float)$h;
            $y = (float)$y;

            if ($y < $minY) continue;

            $widthOk = abs($w - $targetWidth) / $targetWidth <= $tolerance;
            $heightOk = abs($h - $targetHeight) / $targetHeight <= $tolerance;

            if ($widthOk && $heightOk) {
                return $match; // Return the first valid candidate
            }
        }

        return null; // No candidate found
    }


}



