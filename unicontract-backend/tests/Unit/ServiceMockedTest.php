<?php

namespace Tests\Unit;

use App\Service\EmailService;
use App\Service\LogActivityService;
use App\Service\LoginService;
use App\Service\NotificaService;
use App\Service\TitulusExtraDoc;
use App\Service\TitulusHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App as AppFacade;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Mockery;
use Tests\TestCase;

/**
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class ServiceMockedTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testLoginServiceWithMockedModels()
    {
        $personaleMock = Mockery::mock('alias:App\\Personale');
        $mappingRuoloMock = Mockery::mock('alias:App\\MappingRuolo');
        $anagraficaUgovMock = Mockery::mock('alias:App\\Models\\AnagraficaUgov');

        $personaleForAuth = new class {
            public function isDocente()
            {
                return true;
            }

            public function isPta()
            {
                return false;
            }
        };

        $personaleForRole = new class {
            public $id_ab = 88;
            public $nome = 'Mario Rossi';
            public $ruolo;
            public $unita;

            public function __construct()
            {
                $this->ruolo = new class {
                    public function isDocente()
                    {
                        return false;
                    }

                    public function isPta()
                    {
                        return true;
                    }
                };

                $this->unita = (object) ['uo' => 'UO-TEST'];
            }
        };

        $personaleMock->shouldReceive('FindByEmail')
            ->once()
            ->with('auth@uniurb.it')
            ->andReturn($personaleForAuth);

        $personaleMock->shouldReceive('FindByEmail')
            ->once()
            ->with('pta@uniurb.it')
            ->andReturn($personaleForRole);

        $anagraficaUgovMock->shouldReceive('FindByEmail')
            ->once()
            ->with('docente@uniurb.it')
            ->andReturn((object) ['id_ab' => 77]);

        $mappingRuoloMock->shouldReceive('where')
            ->once()
            ->with('unitaorganizzativa_uo', 'UO-TEST')
            ->andReturnSelf();

        $mappingRuoloMock->shouldReceive('get')
            ->once()
            ->andReturn(collect([
                (object) ['role' => (object) ['name' => 'admin']],
                (object) ['role' => (object) ['name' => 'viewer']],
            ]));

        $service = new LoginService();

        $this->assertTrue($service->isAuthorized('auth@uniurb.it'));

        $docenteData = $service->findDocenteData('docente@uniurb.it');
        $this->assertSame(77, $docenteData['id_ab']);
        $this->assertSame(['op_docente'], $docenteData['ruoli']);

        $roleData = $service->findUserRoleAndData('pta@uniurb.it');
        $this->assertSame(88, $roleData['id_ab']);
        $this->assertSame(['admin', 'viewer'], $roleData['ruoli']);
    }

    public function testEmailServiceSendToDocenteInLocalEnvironment()
    {
        $authUser = (object) ['id' => 1, 'email' => 'auth@uniurb.it'];
        $emailPayload = new \stdClass();

        AppFacade::shouldReceive('environment')
            ->once()
            ->with(['local', 'preprod'])
            ->andReturn(true);

        Auth::shouldReceive('user')
            ->twice()
            ->andReturn($authUser);

        Mail::shouldReceive('to')
            ->once()
            ->with($authUser)
            ->andReturnSelf();

        Mail::shouldReceive('send')
            ->once()
            ->with($emailPayload);

        EmailService::sendToDocente($emailPayload, (object) []);

        $this->assertTrue(true);
    }

    public function testLogActivityServiceAddAndListWithMocks()
    {
        $logActivityMock = Mockery::mock('alias:App\\LogActivity');
        $content = str_repeat('a', 700);
        $request = Request::create(
            'https://example.test/resource',
            'POST',
            [],
            [],
            [],
            ['REMOTE_ADDR' => '127.0.0.1', 'HTTP_USER_AGENT' => 'PHPUnit'],
            $content
        );

        $this->app->instance('request', $request);

        Auth::shouldReceive('user')->once()->andReturn(null);

        $logActivityMock->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($payload) {
                return $payload['subject'] === 'subject-test'
                    && $payload['url'] === 'https://example.test/resource'
                    && $payload['method'] === 'POST'
                    && $payload['ip'] === '127.0.0.1'
                    && $payload['agent'] === 'PHPUnit'
                    && $payload['user_id'] === -1
                    && is_string($payload['request'])
                    && strlen($payload['request']) <= 503;
            }));

        $expected = collect([(object) ['subject' => 'older'], (object) ['subject' => 'latest']]);

        $logActivityMock->shouldReceive('latest')->once()->andReturnSelf();
        $logActivityMock->shouldReceive('get')->once()->andReturn($expected);

        LogActivityService::addToLog('subject-test');
        $result = LogActivityService::logActivityLists();

        $this->assertSame($expected, $result);
    }

    public function testNotificaServiceFiltersOnlyValidNotifications()
    {
        config(['unidem.timezone' => 'UTC']);

        $notificaMock = Mockery::mock('alias:App\\Notifica');

        $validNotifica = (object) [
            'tipo_vincolo' => 'vincolo_anno_rapporto',
            'dati' => (object) [
                'vincolo_anno' => '2025',
                'vincolo_natura_rapporto' => 'DOC',
            ],
        ];

        $invalidNotifica = (object) [
            'tipo_vincolo' => 'vincolo_anno_rapporto',
            'dati' => (object) [
                'vincolo_anno' => '2024',
                'vincolo_natura_rapporto' => 'DOC',
            ],
        ];

        $notificaMock->shouldReceive('where')->once()->with('stato', 'attivo')->andReturnSelf();
        $notificaMock->shouldReceive('where')->once()->with('riferimento', 'RCP')->andReturnSelf();
        $notificaMock->shouldReceive('whereDate')->once()->with('data_inizio', '<=', Mockery::type('string'))->andReturnSelf();
        $notificaMock->shouldReceive('whereDate')->once()->with('data_fine', '>=', Mockery::type('string'))->andReturnSelf();
        $notificaMock->shouldReceive('get')->once()->andReturn(collect([$validNotifica, $invalidNotifica]));

        $precontr = (object) [
            'insegnamento' => (object) ['aa' => '2025'],
            'p2naturarapporto' => (object) ['natura_rapporto' => 'DOC'],
        ];

        $service = new NotificaService();
        $result = $service->getNotifiche('RCP', $precontr);

        $this->assertCount(1, $result);
        $this->assertSame($validNotifica, $result[0]);
    }

    public function testTitulusHelperGetTitulusUrlUsesConfiguredBaseWhenQueryIsPresent()
    {
        config(['titulus.url' => 'https://titulus.example.test']);

        $soapControllerMock = Mockery::mock('overload:App\\Http\\Controllers\\SoapControllerTitulus');
        $soapControllerMock->shouldReceive('getDocumentURL')
            ->once()
            ->with('12345')
            ->andReturn('https://legacy.example.test/xway/application/xdocway/engine/xdocway.jsp?verbo=queryplain&wfActive=false');

        $result = TitulusHelper::getTitulusUrl('12345');

        $this->assertSame(
            'https://titulus.example.test/xway/application/xdocway/engine/xdocway.jsp?verbo=queryplain&wfActive=false',
            $result['url']
        );
    }

    public function testTitulusExtraDocBuildsXmlStructure()
    {
        $root = new \SimpleXMLElement('<extra/>');

        TitulusExtraDoc::addRegistro($root, [
            'tipo' => 'interno',
            'anno_accademico' => '2025/2026',
            'periodo_didattico' => '1',
            'vigenza_contrattuale_dal' => '2025-10-01',
            'vigenza_contrattuale_al' => '2026-02-28',
        ]);

        TitulusExtraDoc::addIstituzione($root, [
            'cod' => 'UNIURB',
            'denominazione' => 'Universita',
            'dipartimento' => 'DISPEA',
            'dipartimento_cod' => 'D01',
        ]);

        TitulusExtraDoc::addDati_conservazione($root, [
            'tipologia' => 'documento',
            'versione' => '1.0',
        ]);

        TitulusExtraDoc::addSistemaMittente($root, [
            'precontr_id' => '10',
            'user_id' => '20',
            'applicativo' => 'Unicontract',
        ]);

        TitulusExtraDoc::addEvento($root, [
            'denominazione' => 'Firma',
            'data' => '2026-02-18',
            'agente_tipo' => 'persona',
            'agente_denominazione' => 'Mario Rossi',
            'agente_matricola' => 'A123',
        ]);

        TitulusExtraDoc::addPersona($root, [
            'codice_fiscale' => 'RSSMRA80A01H501U',
            'cognome' => 'Rossi',
            'nome' => 'Mario',
            'data_nascita' => '1980-01-01',
            'luogo_nascita' => 'Pesaro',
            'sesso' => 'M',
            'nazione_nascita' => 'Italia',
            'cod_ANS' => 'IT',
            'email' => 'mario.rossi@example.test',
        ]);

        $parent = $root->addChild('container');
        $from = new \SimpleXMLElement('<child>value</child>');
        TitulusExtraDoc::xml_append($parent, $from);

        $xml = $root->asXML();

        $this->assertStringContainsString('<registro tipo="interno">', $xml);
        $this->assertStringContainsString('<istituzione cod="UNIURB">', $xml);
        $this->assertStringContainsString('<dati_conservazione tipologia="documento" versione="1.0"/>', $xml);
        $this->assertStringContainsString('<precontr_id>10</precontr_id>', $xml);
        $this->assertStringContainsString('<agente tipo="persona">', $xml);
        $this->assertStringContainsString('<codice_fiscale>RSSMRA80A01H501U</codice_fiscale>', $xml);
        $this->assertStringContainsString('<child>value</child>', $xml);
    }
}
