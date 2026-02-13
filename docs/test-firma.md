<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# FirmaTestMocked.php – Test Mockati (FirmaIO / USIGN)

## Overview

Il file `FirmaTestMocked.php` contiene versioni completamente mockate
dei test che richiedono servizi esterni (FirmaIO, USIGN).

Questi test:

- Non effettuano chiamate HTTP reali
- Non richiedono credenziali esterne
- Non generano side effect
- Sono eseguibili in GitHub Actions

⚠️ Il file `FirmaTest.php` contiene invece test legacy con possibili chiamate reali.

---

# Test Inclusi

## Test Modelli (2)

1. **testModelliCreazioneAttrsAndStore** – Creazione modello `SignatureRequest` con `Attrs`
2. **testModelliCreazioneAttrsAndStore1** – Creazione modello con `Attrs` annidati

---

## Test FirmaIO Mockati

1. **testCreateDossierMocked** – Creazione dossier (mock HTTP)
2. **testGetDossierMocked** – Recupero dossier (mock HTTP)
3. **testGetSignerIdMocked** – Recupero ID firmatario (mock HTTP)
4. **testValidateDocumentRequestMocked** – Validazione documento (mock HTTP)
5. **testCreateSignatureRequestMocked** – Creazione richiesta firma (mock HTTP)
6. **testUploadURLMocked** – Download URL caricamento (mock HTTP)
7. **testUploadFirmaIOMocked** – Upload file su FirmaIO (mock HTTP)
8. **testGetSignatureRequestMocked** – Recupero richiesta firma (mock HTTP)
9. **testPubblicazioneRichiestaMocked** – Pubblicazione richiesta (mock HTTP)
10. **testSendNotificationMocked** – Invio notifica (mock HTTP)
11. **testDownloadSignedDocumentMocked** – Download documento firmato (mock HTTP)

---

## Test USIGN Mockati

1. **testUploadUSIGNMocked** – Upload documento USIGN (mockery)
2. **testUploadFinishedUSIGNMocked** – Conferma upload USIGN (mockery)
3. **testOtpTypeUSIGNMocked** – Tipo OTP USIGN (mockery)
4. **testSendOtpUSIGNMocked** – Invio OTP USIGN (mockery)

---

# Tecniche di Mock Utilizzate

## Http::fake() – FirmaIO

```php
Http::fake([
    'api.firmaio.it/*' => Http::response([
        'id' => 'mock-id',
        'title' => 'Mock Title'
    ], 200),
]);
```

---

## Mockery – USIGN

```php
$mock = Mockery::mock(FirmaUSIGNService::class);
$mock->shouldReceive('upload')->andReturn($mockResponse);
```

---

## Storage::fake() – File

```php
Storage::fake('local');
Storage::disk('local')->put('contratto_test.pdf', 'fake content');
```

---

# Esecuzione

## Tutti i test mockati

```bash
cd unicontract-backend
./vendor/bin/phpunit --testsuite Unit --filter "Mocked"
```

## Solo test FirmaIO

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testCreate|testGet|testValidate|testUpload|testPubblicazione|testSendNotification|testDownload"
```

## Solo test USIGN

```bash
./vendor/bin/phpunit --testsuite Unit --filter "USIGN"
```

---

# Nota sui Test Legacy

Nel file `FirmaTest.php` possono essere presenti test con chiamate reali.

Esempio di test marcato come skipped:

```php
/**
 * @requires-service FirmaIO
 */
public function testCreateDossierLegacy()
{
    $this->markTestSkipped('Richiede connessione a FirmaIO esterno');
}
```

Questi test non devono essere eseguiti in CI generica.

---

# Principio

I test mockati devono:

- Testare la logica applicativa
- Non dipendere dallo stato di servizi esterni
- Essere deterministici
- Essere eseguibili in CI/CD
