<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Esecuzione Test – Backend (Laravel / PHPUnit)

## Overview

I test backend sono organizzati per ambiente:

- **GitHub Actions (CI)**: esegue solo test deterministici e CI-safe
- **Locale**: puoi eseguire tutti i test, inclusi quelli che richiedono DB/configurazioni specifiche
- **Integration/External**: test che richiedono servizi esterni (SOAP/HTTP) o Oracle (da eseguire solo in ambienti controllati)

---

## Test Backend – Eseguibili su GitHub Actions (whitelist)

Questi test vengono eseguiti automaticamente in GitHub (selezione tramite `--filter`):

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation|testQueryPrecontr|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse"
```

### Requisiti CI
- Database MySQL (creato nella pipeline)
- Utente `enrico.oliva@uniurb.it` (creato con `php artisan migrate --seed`)

---

## Esecuzione Locale

### Preparazione

```bash
cd unicontract-backend
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### Eseguire solo i test CI (stessa whitelist)

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation|testQueryPrecontr|testReadStoreAttachment|testStatoCivile|testValidazioneSamlResponse"
```

Oppure un singolo test:

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testInsegamentiRelation"
```

### Eseguire test che richiedono utente

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testPrecontrattuale|testDateInsegnamento"
```

### Eseguire test che richiedono Oracle

```bash
./vendor/bin/phpunit --testsuite Unit --filter "testCalcoloNumeroRinnovi"
```

> Nota: richiede connessione a database Oracle configurata.

### Eseguire tutti i test

```bash
./vendor/bin/phpunit
```

---

## System di Marker (Backend)

I test possono includere marker PHPDoc per indicare dipendenze:

- `@github-executable true`
- `@requires-database`
- `@requires-database-oracle`
- `@requires-user <email>`
- `@requires-service <name>`

Esempio:

```php
/**
 * @github-executable true
 * @requires-user enrico.oliva@uniurb.it
 */
public function testQueryPrecontr()
{
    // ...
}
```

---

## CI/CD Pipeline

La pipeline GitHub Actions esegue automaticamente:

1. **Setup PHP 8.2**
2. **Installazione dipendenze Composer**
3. **Configurazione database MySQL**
4. **Migrazione e seeding**
5. **Esecuzione dei test CI-safe (whitelist tramite `--filter`)**
6. **Parallel test execution** - Ogni test viene eseguito separatamente (se configurato nel workflow)

> Nota: i dettagli esatti dipendono dal workflow presente nel repository (es. file in `.github/workflows/`).


---

## Troubleshooting

### "SQLSTATE[HY000] [2002] Connection refused"
- MySQL non disponibile o credenziali errate in `.env`
- verificare `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

### "Exception: Detected use of ENTITY in XML"
Il test `testValidazioneSamlResponse` richiede `response.xml` in:

- `storage/app/`

### "User not authenticated"
Eseguire:

```bash
php artisan migrate --seed
```
