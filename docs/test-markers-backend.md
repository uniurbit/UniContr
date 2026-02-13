<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Test Markers – Backend (GitHub Actions)

## Descrizione

Questo documento descrive il sistema di marker utilizzato per categorizzare i test backend
in base alle loro dipendenze e per determinare quali possono essere eseguiti in GitHub Actions.

I marker sono commenti PHPDoc e non fanno parte dello standard PHPUnit.

---

# Marker Disponibili

## `@github-executable true`

Indica che il test è completamente eseguibile in GitHub Actions.

### Requisiti soddisfatti

- Non richiede database Oracle
- Non richiede servizi esterni reali
- Può utilizzare mock (`Http::fake()`, `Storage::fake()`, `Mockery`)
- L’utente `enrico.oliva@uniurb.it` viene creato tramite `php artisan migrate --seed`

### Test CI-safe con descrizione

- `testInsegamentiRelation` – Test sulle relazioni tra modelli
- `testReadStoreAttachment` – Test su storage e gestione allegati
- `testStatoCivile` – Test su liste di stato civile
- `testValidazioneSamlResponse` – Test validazione XML SAML
- `testQueryPrecontr` – Test sulle query (richiede utente creato dal seeder)

### Test FirmaIO Mockati

- `testModelliCreazioneAttrsAndStore` – Creazione modello SignatureRequest con Attrs
- `testModelliCreazioneAttrsAndStore1` – Creazione modello con Attrs annidati
- `testCreateDossierMocked` – Creazione dossier (mock HTTP)
- `testGetDossierMocked` – Recupero dossier (mock HTTP)
- `testGetSignerIdMocked` – Recupero ID firmatario (mock HTTP)
- `testValidateDocumentRequestMocked` – Validazione documento (mock HTTP)
- `testCreateSignatureRequestMocked` – Creazione richiesta firma (mock HTTP)
- `testUploadURLMocked` – Download URL caricamento (mock HTTP)
- `testUploadFirmaIOMocked` – Caricamento file su FirmaIO (mock HTTP)
- `testGetSignatureRequestMocked` – Recupero richiesta firma (mock HTTP)
- `testPubblicazioneRichiestaMocked` – Pubblicazione richiesta (mock HTTP)
- `testSendNotificationMocked` – Invio notifica (mock HTTP)
- `testDownloadSignedDocumentMocked` – Download documento firmato (mock HTTP)

### Test USIGN Mockati

- `testUploadUSIGNMocked` – Caricamento documento USIGN (mockery)
- `testUploadFinishedUSIGNMocked` – Conferma upload USIGN (mockery)
- `testOtpTypeUSIGNMocked` – Tipo OTP USIGN (mockery)
- `testSendOtpUSIGNMocked` – Invio OTP USIGN (mockery)

---

## `@requires-database`

Il test richiede accesso al database MySQL.

---

## `@requires-database-oracle`

Il test richiede accesso a database Oracle (UGOV).

### Test interessati

- `testCalcoloNumeroRinnovi` – Calcolo numero rinnovi
- `testUgovCompensi` – Lettura compensi da UGOV
- `testUgovPagamentoCompensi` – Pagamento compensi UGOV
- `test_ContrUgovExportCSV` – Export CSV da dati UGOV
- `test_InseganmentiConSegmentiUgov` – Insegnamenti con segmenti UGOV

---

## `@requires-user <email>`

Il test richiede autenticazione con un utente specifico.

Esempio:

`@requires-user enrico.oliva@uniurb.it`

---

## `@requires-service <service>`

Indica che il test richiede un servizio esterno.

Servizi comuni:

- PDF – Generazione PDF
- Email – Invio email
- Titulus – Integrazione Titulus
- FirmaIO – Firma digitale FirmaIO
- USIGN – Firma digitale USIGN

---

# Flusso di Esecuzione in GitHub Actions

Esempio comando CI:

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse|testQueryPrecontr|testCreateDossierMocked|testUploadUSIGNMocked"
```

La whitelist completa dipende dal workflow presente in `.github/workflows/`.

---

# Principio Fondamentale

La CI deve rimanere:

- deterministica
- veloce
- indipendente da sistemi esterni

Le integrazioni reali devono essere testate separatamente.
