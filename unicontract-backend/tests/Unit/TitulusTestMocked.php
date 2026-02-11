<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Spatie\ArrayToXml\ArrayToXml;
use App\Models\Titulus\Fascicolo;
use App\Models\Titulus\Documento;
use App\Models\Titulus\Rif;
use App\Models\Titulus\Element;

class TitulusTestMocked extends TestCase
{
    use WithoutMiddleware;

    public function testXML1()
    {
        $array = [
            'Good guy' => [
                'name' => [
                    '_value' => 'valore',
                    '_attributes' => ['attr' => 'prova'],
                ],
                'weapon' => 'Lightsaber'
            ],
            'Bad guy' => [
                'name' => 'Sauron',
                'weapon' => 'Evil Eye'
            ]
        ];
                
        $result = ArrayToXml::convert($array);
        $this->assertNotNull($result);
    }

    public function testXMLFascicolo()
    {
        $fascicolo = new Fascicolo;
        $fascicolo->oggetto = 'prova';
        $fascicolo->rootElementAttributes->stato = 'prova';
        $result = $fascicolo->toXml();
        $this->assertNotNull($result);
    }

    public function testXMLDocumento()
    {
        $doc = new Documento;
        $doc->rootElementAttributes->tipo = 'arrivo';
        $doc->addAllegato('1 - test1');
        $doc->addAllegato('2 - test2');        

        $doc->voce_indice = 'UNIPEO - Domanda di progressione economica orizzontale';        
            
        $nome = new Element('nome');
        $nome->rootElementAttributes->nominativo ="Mario Rossi";
        $nome->rootElementAttributes->cod = "SE000095";

        $rif_esterno = new Rif('rif_esterno');
        $rif_esterno->nome = $nome;

        $rif_esterno1 = new Rif('rif_esterno');
        $rif_esterno1->nome = "pippo";

        $doc->rif_esterni = array($rif_esterno, $rif_esterno1);

        $arr = $doc->toArray();        
        $this->assertNotNull($arr);
        $result = $doc->toXml();
        $this->assertEquals(str_replace(array("\n", "\r"), '', $result),'<?xml version="1.0" encoding="UTF-8"?><doc tipo="arrivo"><allegato>1 - test1</allegato><allegato>2 - test2</allegato><voce_indice>UNIPEO - Domanda di progressione economica orizzontale</voce_indice><rif_esterni><rif_esterno><nome cod="SE000095" nominativo="Mario Rossi"/></rif_esterno><rif_esterno><nome>pippo</nome></rif_esterno></rif_esterni></doc>');
    }

    public function testXMLAddInFascicolo()
    {
       $xmlInFolder = new Fascicolo();
       $xmlInFolder->rootElementAttributes->nrecord ='878-UNIURB';
       $xmlInFolder->addDoc('024-UNIURB');

       $this->assertEquals(str_replace(array("\n", "\r"), '', $xmlInFolder->toXml()),'<?xml version="1.0" encoding="UTF-8"?><fascicolo nrecord="878-UNIURB"><doc nrecord="024-UNIURB"/></fascicolo>');
    }

    public function testTitulusFindSignedFile()
    {
        $xmlresponse = '<?xml version="1.0" encoding="UTF-8"?>

        <Response xmlns:xw="http://www.kion.it/ns/xw" canSee="true" canLinkFolder="true">
          <url>https://titulus-uniurb.cineca.it/xway/application/xdocway/engine/xdocway.jsp?verbo=queryplain&amp;query=%5B//@physdoc%5D%3D963099&amp;wfActive=false&amp;codammaoo=UNURCLE</url>
          <Document physdoc="963099">
            <doc nrecord="000963099-UNURCLE-16be3bd3-c0d5-490f-bac0-01551179c3ff" scarto="99" tipo="partenza" physdoc="963099" data_prot="20201210" anno="2020" cod_amm_aoo="UNURCLE" annullato="no" num_prot="2020-UNURCLE-0055933">
             
              <files>
                <xw:file index="yes" name="ZMjIFVJn17a7YldZVKpoow==_000908648-FS_FILES-820685b8-2107-4cbe-aaac-f4a7e413448a[1].pdf" signed="false" title="Contratto di insegnamento">
                  <chkin cod_operatore="PI000246" data="20201210" operatore="unicontr2_ws utente" ora="10:20:07"/>
                  <chkout operatore="ROSSI CATIA (Segreteria del Direttore Generale)" cod_operatore="002823" data="20201210" ora="11:05:05"/>
                  <DigestMethod Algorithm="SHA-256"/>
                  <DigestValue>a2f81944819651c465896a4f1b8b597dfed766f52f0a540d4a5a1448cdc2424f</DigestValue>
                  <xw:file name="Auz0X280YFAgx5oyzl0utQ==_000908744-FS_FILES-c4aca718-ee57-435a-b7e3-4f0a6f80dc37[1].pdf" title="Contratto di insegnamento" index="yes" signed_from="000908648-FS_FILES-820685b8-2107-4cbe-aaac-f4a7e413448a[1].pdf" signed="true">
                    <chkin operatore="ROSSI CATIA (Segreteria del Direttore Generale)" cod_operatore="002823" data="20201210" ora="11:05:05"/>
                    <DigestMethod Algorithm="SHA-256"/>
                    <DigestValue>bc0534c1d1171c9d9ffdfb65c8d64cbaf98bd9a269f9edcf0813febcf19f5c36</DigestValue>
                  </xw:file>
                </xw:file>
              </files>

            </doc>
          </Document>
        </Response>';
       

        $obj = simplexml_load_string($xmlresponse);
        $document = $obj->Document;        
        $doc = $document->doc;                
        foreach ($doc->files->children('xw',true) as $file) {            
            $signed = (string) $file->attributes()->signed;
            if ($signed == 'false'){
                foreach ($file->children('xw',true) as $internalfile) {
                    $signed = (string) $internalfile->attributes()->signed;
                    if ($signed == 'true'){
                        $fileId = (string) $internalfile->attributes()->name;                    
                        $this->assertEquals('Contratto di insegnamento',(string) $internalfile->attributes()->title); 
                        $this->assertEquals('Auz0X280YFAgx5oyzl0utQ==_000908744-FS_FILES-c4aca718-ee57-435a-b7e3-4f0a6f80dc37[1].pdf',$fileId);                         
                        return;          
                    }
                }
            }
            $fileId = (string) $file->attributes()->name;                    
            $this->assertEquals('Contratto di insegnamento',(string) $file->attributes()->title); 
            $this->assertEquals('ZMjIFVJn17a7YldZVKpoow==_000908648-FS_FILES-820685b8-2107-4cbe-aaac-f4a7e413448a[1].pdf',$fileId);                         

        }
    }

}
