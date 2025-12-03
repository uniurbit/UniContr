<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Backend – Struttura e Avvio

Questa sezione descrive la **struttura del progetto backend** di UniContr e i comandi principali per l'installazione e l'avvio.

---

## Struttura Progetto

* Moduli principali:

  * Gestione precontrattuali
  * Dashboard
  * Generazione PDF
* Migrazioni e seeders per database
* API REST documentate in [api.md](api.md)

---

## Comandi Principali

1. **Avvio del backend**

```bash
php artisan serve
```

2. **Migrazione e popolamento database**

```bash
php artisan migrate:fresh --seed
```

---

## Installazione Backend

1. Entrare nella cartella del backend:

```bash
cd .\unicontr-backend\
```

2. Creare il file di configurazione `.env` copiando e rinominando `.env.example` e aggiornando:

   * Nome applicazione
   * Database di riferimento
   * Altre configurazioni necessarie

3. Installare i package PHP:

```bash
composer install
```

4. Installazione certificato per SSO:

```bash
openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes -out sp.crt -keyout sp.key
sudo cp sp.key vendor/onelogin/php-saml/certs/
sudo cp sp.crt vendor/onelogin/php-saml/certs/
```

5. Eseguire migrazione e seed:

```bash
php artisan migrate:fresh --seed
```

---

Questo setup permette di avviare il backend correttamente e preparare l’ambiente per lo sviluppo o il testing.
