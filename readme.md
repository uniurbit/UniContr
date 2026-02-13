<!-- SPDX-License-Identifier: CC-BY-4.0 -->

![status](https://img.shields.io/badge/status-stabile-brightgreen)

# UniContr

UniContr è una applicazione web per la **proceduralizzazione e dematerializzazione dei contratti di docenza**.  
L'applicazione è basata su **Web API**, sviluppata con **Laravel** per il backend, **Angular** per il frontend e **Shibboleth** come sistema di autenticazione.

---

## Funzionalità Applicative

- 🔥 **Gestione delle precontrattuali:** inserimento, modifica e validazione 
- 🔥 **Storico precontrattuali**
- 🔥 **Dashboard uffici** 
- 🔥 **Generazione contratti (PDF/A)**
- 🔥 **Notifiche a uffici e docenti**
    - Richiesta compilazione modulistica precontrattuale
    - Avvenuta compilazione modulistica
    - Richiesta modifica/integrazioni
    - Visione e accettazione contratto di docenza UniUrb
    - Avvenuta accettazione contratto di insegnamento
    - Report mensile per dipartimento
    - Solleciti di visione/accettazione contratti
- 🔥 **Firma dei contratti**

---

## Struttura precontrattuale

- ⚡️ **Dati insegnamento e posizione collaboratore**
    - P.1 – Dati insegnamento (importati da Ugov)
    - P.2 – Posizione collaboratore e natura del rapporto
- ⚡️ **Dati anagrafici e di posizione**
    - A.1 – Dati anagrafici
    - A.2 – Modalità di pagamento e dati conto corrente
- ⚡️ **Dichiarazioni (Modelli B)**
    - B.1 – Conflitto interessi
    - B.2 – Incompatibilità
    - B.3 – Rapporto studio/lavoro con Università
    - B.4 – Rapporto con Pubblica Amministrazione
    - B.5 – Stato di pensionamento
    - B.6 – Privacy
- ⚡️ **Dati fiscali, tributari e previdenziali**
    - C – Prestazione Professionale
    - D – Collaborazioni autonome
        - D.1 – Previdenziali
        - D.2 – Assicurativi INAIL
        - D.3 – Tributari
        - D.4 – Fiscali
        - D.5 – Fiscali residenti estero
        - D.6 – Detrazioni familiari
    - E – Lavoro autonomo occasionale

---

## Caratteristiche del Sistema

- 🔥 Architettura Web API
- ⚡️ Supporto SSO con Shibboleth
- ⚡️ Integrazione lettura dati da Ugov
- ⚡️ Integrazione Titulus
- ⚡️ Firma digitale tramite **IO** e **U-Sign**
- 📝 Multi utente e multi ruolo
- 📝 Generazione PDF tramite [mpdf](https://github.com/barryvdh/laravel-snappy)
- 😍 Tema Bootstrap
- 💪 Tecnologie principali: Laravel, Angular, Dynamic Forms Angular
- 💪 Costruito su 
    - [Laravel](https://laravel.com/) 
    - [Angular](https://angular.io/)
    - [Dynamic forms in Angular](https://formly.dev/)
- [Schermate UniContr](UniContr.pdf)

---

# Testing

Il progetto include un sistema di test separato per:

- **Backend** – PHPUnit (Laravel)
- **Frontend** – Karma + Jasmine (Angular)

Documentazione completa disponibile nella cartella `docs/`:

- [Panoramica Test](docs/test-overview.md)
- [Esecuzione Test Backend](docs/test-execution-backend.md)
- [Esecuzione Test Frontend](docs/test-execution-frontend.md)
- [Marker Test Backend](docs/test-markers-backend.md)
- [Test Firma (Mocked)](docs/test-firma.md)

---


## Test Backend (Laravel)

Entrare nella cartella:

```bash
cd .\unicontr-backend\
./vendor/bin/phpunit
./vendor/bin/phpunit --filter testNomeMetodo
```

Nota: alcuni test richiedono configurazioni specifiche (Oracle o servizi esterni).
Consultare docs/test-markers-backend.md.

## Test Frontend (Angular)

Entrare nella cartella:

```bash
cd .\unicontr-frontend\
npm install
```

Eseguire test unitari:

```bash
ng test --watch=false --browsers=ChromeHeadless
```


## Configurazione e Avvio

### Creazione di una applicazione

1) Fare un fork del repository 

2) Eseguire il clone del progetto 

### Configurazione UniContr-backend

1) Entrare nella cartella `cd .\unicontr-backend\`

2) Creare un file di configurazione .env (copiare, rinominare e modificare il file .env.exmaple inserendo il nome dell'applicazione, 
il database di riferimento ...)

3) Eseguire `composer install` per l'istallazione dei package

4) Installazione certificato
```
    openssl req -newkey rsa:2048 -new -x509 -days 3652 -nodes -out sp.crt -keyout sp.key
    sudo cp sp.key vendor/onelogin/php-saml/certs/
    sudo cp sp.crt vendor/onelogin/php-saml/certs/
```

4) Eseguire `php artisan migrate:fresh --seed` 

### Configurazione UniContr-frontend

1) Entrare nella cartella `cd .\unicontr-frontend\`

2) Eseguire `npm install`
   
### Configurazione UniContr-mockipd

1) Entrare nella cartella cd `cd .\unicontr-mock-idp\`

2) Eseguire  `npm install fake-sso-idp`

3) Il mock idp è configurato con un utente a cui è associato il ruolo SUPER-ADMIN


### Lancio dell'applicazione

1) Aprire tre terminal

2) Lancio dei servizi di backend 

```   
    cd .\unicontr-backen\
    php artisan serve --port 80
``` 

3) Lancio del frontend

```
    cd .\unicontr-frontend\
    ng serve
```

4) Lancio del mock idp

```
    cd .\unicontr-mock-idp\  
    node start.js
``` 

Aprire il broswer all'indirizzo  `http://localhost:4200/`


## Ambiente di test in docker

- [unicontract-docker](unicontract-docker/readme.md)


---

## Informazioni di Progetto

- **Status:** stabile
- **Copyright:** Università degli Studi di Urbino Carlo Bo
- **Maintainer:** Servizi Sistemi e Software Gestionali e Documentali - Settore ICT, Università degli Studi di Urbino

---

## Licenza

Tutta la documentazione è sotto **[Creative Commons CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)**. 

Happy coding!

