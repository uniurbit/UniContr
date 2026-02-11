# Esecuzione dei Test

## Overview

I test sono organizzati per indicare quali possono essere eseguiti in diversi ambienti:

- **GitHub Actions**: Test automatici eseguiti su ogni push/PR
- **Ambiente Locale**: Test che richiedono la configurazione dell'ambiente
- **Ambiente di Produzione**: Test che richiedono connessioni esterne

Il progetto è composto da:
- **Backend (PHP / Laravel)**
- **Frontend (Angular)**

Entrambi sono integrati nella pipeline CI/CD.


## Test Backend – Eseguibili su GitHub Actions

Questi 5 test vengono eseguiti automaticamente in GitHub:

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation|testQueryPrecontr|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse"
```

### Requisiti
- Database MySQL (viene creato automaticamente)
- Utente `enrico.oliva@uniurb.it` (viene creato con `php artisan migrate --seed`)

## Esecuzione Locale

### Preparazione

1. Copiare il file di configurazione:
```bash
cd unicontract-backend
cp .env.example .env
```

2. Generare la chiave dell'applicazione:
```bash
php artisan key:generate
```

3. Eseguire le migrazioni con seeding:
```bash
php artisan migrate --seed
```

### Eseguire Solo i Test su GitHub

```bash
# Tutti i 5 test eseguibili su GitHub
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation|testQueryPrecontr|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse"

# O uno specifico
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation"
```

### Eseguire Test che Richiedono Utente

```bash
# Test che richiedono l'utente enrico.oliva@uniurb.it
./vendor/bin/phpunit --testsuite Unit --filter "testPrecontrattuale|testDateInsegnamento"
```

### Eseguire Test che Richiedono Oracle

```bash
# Nota: Richiede connessione a database Oracle configurato
./vendor/bin/phpunit --testsuite Unit --filter "testCalcoloNumeroRinnovi"
```

### Eseguire Tutti i Test

```bash
./vendor/bin/phpunit
```

## Analizzare i Test

Usa lo script di analisi nel root del progetto:

```bash
# Report completo
php analyze-tests.php

# Solo test eseguibili su GitHub
php analyze-tests.php --github-only

# Solo test che richiedono Oracle
php analyze-tests.php --oracle-only

# Solo test che richiedono utenti
php analyze-tests.php --user-only
```

## System di Marker

Ogni test è marcato con commenti PHPDoc che indicano le sue dipendenze:

- `@github-executable true` - Eseguibile in GitHub Actions
- `@requires-database` - Richiede MySQL
- `@requires-database-oracle` - Richiede Oracle (non disponibile in GitHub)
- `@requires-user <email>` - Richiede utente specifico
- `@requires-service <name>` - Richiede servizio esterno

Esempio:
```php
/**
 * @github-executable true
 * @requires-user enrico.oliva@uniurb.it
 */
public function testQueryPrecontr()
{
    // Test code
}
```

## CI/CD Pipeline

La pipeline GitHub Actions esegue automaticamente:

1. **Setup PHP 8.2**
2. **Installazione dipendenze Composer**
3. **Configurazione database MySQL**
4. **Migrazione e seeding**
5. **Esecuzione dei 5 test verificati**
6. **Parallel test execution** - Ogni test viene eseguito separatamente

Vedi [.github/workflows/tests-ci.yml](.github/workflows/tests-ci.yml) per i dettagli.

## Troubleshooting

### "SQLSTATE[HY000] [2002] Connection refused"
Database MySQL non è disponibile. Assicurati che:
- Il database sia avviato
- Le credenziali in `.env` siano corrette
- `DB_HOST` sia corretto (127.0.0.1 o localhost)

### "Exception: Detected use of ENTITY in XML"
Il test `testValidazioneSamlResponse` richiede il file `response.xml`. Deve essere:
- Presente in `storage/app/`
- Valido secondo lo schema SAML 2.0

### "User not authenticated"
L'utente `enrico.oliva@uniurb.it` non è stato creato. Esegui:
```bash
php artisan migrate --seed
```

## Aggiungere Nuovi Test

1. Scrivi il test in [tests/Unit/ContrattiTest.php](unicontract-backend/tests/Unit/ContrattiTest.php)
2. Identifica le dipendenze
3. Aggiungi i marker appropriati
4. Se executable in GitHub, aggiornalo in `.github/workflows/tests-ci.yml`

Vedi [docs/test-markers.md](docs/test-markers.md) per la documentazione completa.
