# FirmaTest.php - Versione con Mockup

## Overview

Il file `FirmaTest.php` è stato refactorizzato per includere versioni mockate dei test che richiedono servizi esterni (FirmaIO, USIGN). Questo permette di eseguire i test in GitHub Actions senza dipendenze esterne.

## Cambiamenti Principali

### Versione con Mockup
- ✅ Tutti i test utilizzano mock dei servizi HTTP
- ✅ Eseguibili in GitHub Actions senza configurazioni esterne
- ✅ Consistenti e affidabili
- ✅ Più veloci da eseguire
- ✅ Testano la logica dell'applicazione, non l'API esterna

## Test Aggiunti (Marcati @github-executable)

### Test Modelli (2)
1. **testModelliCreazioneAttrsAndStore** - Test creazione modello SignatureRequest con Attrs
2. **testModelliCreazioneAttrsAndStore1** - Test creazione modello con Attrs annidati

### Test FirmaIO Mockati (8)
1. **testCreateDossierMocked** - Creazione dossier (mock HTTP)
2. **testGetDossierMocked** - Recupero dossier (mock HTTP)
3. **testGetSignerIdMocked** - Recupero ID firmatario (mock HTTP)
4. **testValidateDocumentRequestMocked** - Validazione documento (mock HTTP)
5. **testCreateSignatureRequestMocked** - Creazione richiesta di firma (mock HTTP)
6. **testUploadURLMocked** - Download URL per caricamento (mock HTTP)
7. **testUploadFirmaIOMocked** - Caricamento file su FirmaIO (mock HTTP)
8. **testGetSignatureRequestMocked** - Recupero richiesta di firma (mock HTTP)

### Test FirmaIO - Completamento (3)
1. **testPubblicazioneRichiestaMocked** - Pubblicazione richiesta (mock HTTP)
2. **testSendNotificationMocked** - Invio notifica (mock HTTP)
3. **testDownloadSignedDocumentMocked** - Download documento firmato (mock HTTP)

### Test USIGN Mockati (4)
1. **testUploadUSIGNMocked** - Caricamento documento USIGN (mockery)
2. **testUploadFinishedUSIGNMocked** - Conferma caricamento USIGN (mockery)
3. **testOtpTypeUSIGNMocked** - Tipo OTP USIGN (mockery)
4. **testSendOtpUSIGNMocked** - Invio OTP USIGN (mockery)

## Tecniche di Mock Utilizzate

### 1. Http::fake() - Per FirmaIO
Mock delle risposte HTTP di Laravel:

```php
Http::fake([
    'api.firmaio.it/*' => Http::response([
        'id' => '01H7AAPQ258A3M89TWZZ7GHDCA',
        'title' => 'Contratto di Insegnamento'
    ], 200),
]);
```

### 2. Mockery - Per USIGN
Mock dei metodi dei service:

```php
$mock = Mockery::mock(FirmaUSIGNService::class);
$mock->shouldReceive('client->upload')
    ->andReturn((object)['successful' => function() { return true; }]);
```

### 3. Storage::fake() - Per File
Mock dello storage di Laravel:

```php
Storage::fake('local');
Storage::disk('local')->put('contratto_test.pdf', 'fake pdf content');
```

## Statistiche Attuali

**Test totali:** 43
- **Eseguibili su GitHub:** 22 (51.2%) ✅
  - 5 test di base
  - 17 test FirmaIO/USIGN mockati
- **Richiedono utente specifico:** 19 (44.2%)
- **Richiedono Oracle:** 6 (14.0%)

## Vantaggi dei Test Mockati

1. **Velocità**: Nessuna latenza di rete
2. **Affidabilità**: Non dipendono dallo stato esterno
3. **CI/CD**: Eseguibili in qualsiasi ambiente
4. **Prevedibilità**: Sempre gli stessi risultati
5. **Isolamento**: Testano la logica dell'applicazione

## Esecuzione

### Eseguire Tutti i Test Mockati
```bash
cd unicontract-backend
./vendor/bin/phpunit --testsuite Unit --filter "Mocked"
```

### Eseguire Solo Test FirmaIO
```bash
./vendor/bin/phpunit --testsuite Unit --filter "testCreate|testGet|testValidate|testUpload|testPubblicazione|testSendNotification|testDownload"
```

### Eseguire Solo Test USIGN
```bash
./vendor/bin/phpunit --testsuite Unit --filter "USIGN"
```

### Eseguire in GitHub Actions
I test sono configurati nel workflow `.github/workflows/tests-ci.yml` e vengono eseguiti automaticamente su ogni push/PR.

## Test Legacy (Skipped)

Il test `testCreateDossierLegacy` è stato mantenuto come riferimento ma è marcato come skipped:

```php
/**
 * @requires-service FirmaIO
 */
public function testCreateDossierLegacy()
{
    $this->markTestSkipped('Richiede connessione a FirmaIO esterno');
    // ...
}
```

## Setup dei Test

### setUp()
- Mock di Storage::disk('local')
- Preparazione dell'ambiente

### tearDown()
- Chiusura di Mockery
- Cleanup

## Aggiungere Nuovi Test Mockati

1. **Identificare il metodo da testare**
   ```php
   $client->someMethod()
   ```

2. **Mock della risposta HTTP**
   ```php
   Http::fake([
       'api.firmaio.it/*' => Http::response([...], 200),
   ]);
   ```

3. **Eseguire il metodo**
   ```php
   $response = $client->someMethod();
   ```

4. **Asserire il risultato**
   ```php
   $this->assertTrue($response->successful());
   ```

5. **Aggiungere il marker**
   ```php
   /**
    * @github-executable true
    */
   public function testNewMockMethod()
   ```

## Documentazione Correlata

- [test-markers.md](test-markers.md) - Sistema di marker
- [test-execution.md](test-execution.md) - Guida esecuzione backend test
- [test-execution-frontend.md](test-execution-frontend.md) - Guida esecuzione frontend test
- [.github/workflows/tests-ci.yml](../.github/workflows/tests-ci.yml) - Workflow GitHub Actions
- [.github/workflows/tests-ci.yml](../.github/workflows/angular-tests.yml) - Workflow GitHub Actions
