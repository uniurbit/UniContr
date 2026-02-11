# Test Markers Backend per GitHub Actions

## Descrizione

Questo documento spiega il sistema di marker utilizzato per categorizzare i test in base alle loro dipendenze e indicare quali test possono essere eseguiti in GitHub Actions.

## Marker Disponibili

### `@github-executable true`
Indica che il test può essere eseguito completamente in GitHub Actions. Questo include test che richiedono l'utente `enrico.oliva@uniurb.it` poiché viene creato durante il seeding del database.

**Requisiti soddisfatti:**
- Non richiede connessione a database Oracle
- L'utente `enrico.oliva@uniurb.it` viene creato automaticamente con `php artisan migrate --seed`
- Non richiede servizi esterni non disponibili in GitHub
- Non richiede configurazioni di produzione

**Test marcati:**
- `testInsegamentiRelation` - Test sulle relazioni tra modelli
- `testReadStoreAttachment` - Test su storage e allegati
- `testStatoCivile` - Test su liste di stato civile
- `testValidazioneSamlResponse` - Test su validazione XML SAML
- `testQueryPrecontr` - Test sulle query (richiede utente Enrico creato dal seeder)

### `@requires-database`
Il test richiede accesso al database MySQL. Viene eseguito solo in ambienti con database configurato.

### `@requires-database-oracle`
Il test richiede accesso al database Oracle (UGOV). **NON viene eseguito in GitHub Actions** poiché Oracle non è disponibile.

**Test interessati:**
- `testCalcoloNumeroRinnovi`
- `testUgovCompensi`
- `testUgovPagamentoCompensi`
- `test_ContrUgovExportCSV`
- `test_InseganmentiConSegmentiUgov`

### `@requires-user <email>`
Il test richiede un utente specifico autenticato. **NON viene eseguito in GitHub Actions** poiché l'utente non esiste nell'ambiente di test.

**Email comuni:**
- `enrico.oliva@uniurb.it` - Utente principale per test con dati reali

### `@requires-service <service>`
Il test richiede un servizio specifico. Potrebbe non essere disponibile in GitHub Actions.

**Servizi comuni:**
- `PDF` - Generazione PDF 
- `Email` - Invio email
- `Titulus` - Integrazione Titulus
- `FirmaIO` - Firma digitale FirmaIO
- `USIGN` - Firma digitale USIGN

## Flusso di Esecuzione

### GitHub Actions CI/CD
In GitHub Actions vengono eseguiti **solo** i test marcati con `@github-executable true`:

```bash
./vendor/bin/phpunit \
  --testsuite Unit \
  --filter "testInsegamentiRelation|testReadStoreAttachment|testStatoCivile|validazioneSamlResponse"
```
- `Email` - Invio email
- `Titulus` - Integrazione Titulus
- `FirmaIO` - Firma digitale FirmaIO (mockato in GitHub)
- `USIGN` - Firma digitale USIGN (mockato in GitHub)

## Flusso di Esecuzione

### GitHub Actions CI/CD
In GitHub Actions vengono eseguiti **22 test** marcati con `@github-executable true`:

```bash
./vendor/bin/phpunit \
  --testsuite Unit \
  --filter "testInsegamentiRelation|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse|testQueryPrecontr|testModelliCreazioneAttrsAndStore|testCreateDossierMocked|testGetDossierMocked|testGetSignerIdMocked|testValidateDocumentRequestMocked|testCreateSignatureRequestMocked|testUploadURLMocked|testUploadFirmaIOMocked|testGetSignatureRequestMocked|testPubblicazioneRichiestaMocked|testSendNotificationMocked|testDownloadSignedDocumentMocked|testUploadUSIGNMocked|testUploadFinishedUSIGNMocked|testOtpTypeUSIGNMocked|testSendOtpUSIGNMocked"
```

**Test FirmaIO Mockati** (17 test):
- Utilizzano `Http::fake()` di Laravel per mockare le risposte HTTP
- Non richiedono accesso ai servizi esterni
- Testano la logica dell'applicazione senza dipendenze esterne
### Esecuzione Locale
Per eseguire test specifici localmente:

```bash
# Test eseguibili in GitHub
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation"

# Test con database
./vendor/bin/phpunit --testsuite Unit --filter "testPrecontrattuale"

# Test con database Oracle
./vendor/bin/phpunit --testsuite Unit --filter "testCalcoloNumeroRinnovi"

# Test FirmaIO mockati
./vendor/bin/phpunit --testsuite Unit --filter "testCreateDossierMocked"

# Test con database
./vendor/bin/phpunit --testsuite Unit --filter "testPrecontrattuale"
```

## Come Aggiungere Nuovi Test

### Passo 1: Scrivere il test
```php
public function testNewFeature()
{
    // Test code
}
```

### Passo 2: Identificare le dipendenze

- **Nessuna dipendenza esterna?** → Aggiungere `@github-executable true`
- **Richiede DB?** → Aggiungere `@requires-database`
- **Richiede Oracle?** → Aggiungere `@requires-database-oracle`
- **Richiede utente?** → Aggiungere `@requires-user <email>`
- **Richiede servizi?** → Aggiungere `@requires-service <service>`

### Passo 3: Aggiungere i marker

```php
/**
 * Descrizione del test
 * @requires-database
 * @requires-user enrico.oliva@uniurb.it
 */
public function testNewFeature()
{
    // Test code
}
```

## Statistiche Attuali

**Test totali:** 24

**Breakdown:**
- ✅ Eseguibili su GitHub: 5 (20.8%)
  - testInsegamentiRelation
  - testReadStoreAttachment
  - testStatoCivile
  - validazioneSamlResponse
  - testQueryPrecontr (utente Enrico creato dal seeder)
  - validazioneSamlResponse

- ❌ Richiedono utente specifico: 14
  - testPrecontrattuale
  - testDateInsegnamento
  - testQueryPrecontr
  - testGeneraPdfConflitto
  - testGeneraPdfConflittoTrasparenza
  - testSendFirstEmail
  - testGenerazioneContratto
  - testTitulusContratto
  - testPosizioneFirmaContratto
  - testFirmaContrattoUSIGN
  - test_exportCSV
  - test_exportXLS
  - testGenerazioneReport
  - testGenPrecontrattualeReport

- ❌ Richiedono Oracle: 6
  - test1CalcoloNumeroRinnovi
  - testCalcoloNumeroRinnovi
  - testUgovCompensi
  - testUgovPagamentoCompensi
  - test_ContrUgovExportCSV
  - test_InseganmentiConSegmentiUgov

## File Correlati

- [.github/workflows/tests-ci.yml](.github/workflows/tests-ci.yml) - Configurazione GitHub Actions
- [tests/Unit/ContrattiTest.php](unicontract-backend/tests/Unit/ContrattiTest.php) - Test file con marker

## Note Importanti

1. **Marker non sono standard PHPUnit**: Questi marker sono custom e riconosciuti dal workflow GitHub
2. **Nessun impatto sul codice**: I marker sono comentari, non influenzano l'esecuzione
3. **Facilmente estensibili**: È possibile aggiungere nuovi marker secondo le necessità
4. **Documentazione nel codice**: Ogni marker è commentato nel test
