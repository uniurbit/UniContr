UniContr è una applicazione web per la proceduralizzazione e dematerializzazione dei contratti di docenza. L'applicazione è basata su Web API e sviluppata sul framework Laravel per la parte backend, Angular per la parte frontend e Shibboleth come sistema di autenticazione.
-------------------------------

## Funzionalità Applicative

- 🔥 Gestione delle precontrattuali: inserimento, modifica e validazione 
- 🔥 Storico precontrattuali
- 🔥 Dashboard uffici 
- 🔥 Generazione contratto
- 🔥 Nofiche uffici e docenti 
    - Richiesta Compilazione Modulistica Precontrattuale
    - Avvenuta compilazione modulistica precontrattuale
    - Richiesta modifica/integrazioni modulistica precontrattuale
    - Visione e accettazione contratto di docenza UniUrb
    - Avvenuta accettazione contratto di insegnamento 
    - Report mensile per dipartimento con elenco contratti di docenza non ancora stipulati
    - Solleciti di Visione e accettazione contratto docenza UniUrb e Compilazione Modulistica Precontrattuale

## Struttura precontrattuale 

- ⚡️ Dati relativi all'insegnamento e posizione del collaboratore 
      - Modello P.1 Dati relativi all'insegnamento (importati da Ugov didattica)
      - Modello P.2 Posizione del collaboratore e natura del rapporto 
- ⚡️ Dati anagrafici e di posizione
    - Modelli A
        - A.1 - Dati anagrafici del collaboratore
        - A.2 - Modalità di pagamento e dati relativi al Conto Corrente
    - Modelli B
        - B.1 - Dichiarazione sul conflitto di interessi
        - B.2 - Dichiarazione sulla incompatibilità
        - B.3 - Dichiarazione in merito al rapporto di studio o lavoro con l’Università
        - B.4 - Dichiarazione in merito al rapporto di lavoro con la Pubblica Amministrazione
        - B.5 - Dichiarazione in merito allo stato di pensionamento
        - B.6 - Trattamento dati e Informativa sulla privacy
- ⚡️ Dati tributari, fiscali e previdenziali
    - Modello C Prestazione Professionale 
    - Modelli D Prestazione d’opera in qualità di Collaborazione di Natura Autonoma
        - D.1 - Dichiarazione ai fini previdenziali
        - D.2 - Dichiarazione ai fini assicurativi INAIL
        - D.3 - Dichiarazione ai fini tributari
        - D.4 - Dichiarazione ai fini fiscali
        - D.5 - Dichiarazione ai fini fiscali per i residenti all'estero
        - D.6 - Richiesta detrazioni fiscali per familiari a carico
    - Modello E Prestazione di Lavoro Autonomo Occasionale 


## Caratteristiche sistema

- 🔥 Applicazione web con architettura basata su Web API
- ⚡️ Supporto per il SSO con Shibbolet
- ⚡️ Integrazione per la lettura dati da Ugov
    - lettura afferenza organizzativa
- ⚡️ Integrazione con Titulus 
- 📝 Sistema multi utente e multi ruolo
- 📝 Generazione di pdf basato su [wkhtmltopdf](https://github.com/barryvdh/laravel-snappy)
- 😍 Tema Boostrap 
- 💪 Costruito su 
    - [Laravel](https://laravel.com/) 
    - [Angular](https://angular.io/)
    - [Dynamic forms in Angular](https://formly.dev/)
- [Schermate UniContr](UniContr.pdf)

## Creazione di una applicazione

1) Fare un fork del repository 

2) Eseguire il clone del progetto 

## Configurazione UniContr-backend

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

## Configurazione UniContr-frontend

1) Entrare nella cartella `cd .\unicontr-frontend\`

2) Eseguire `npm install`
   
## Configurazione UniContr-mockipd

1) Entrare nella cartella cd `cd .\unicontr-mock-idp\`

2) Eseguire  `npm install fake-sso-idp`

3) Il mock idp è configurato con un utente a cui è associato il ruolo SUPER-ADMIN


## Lancio dell'applicazione

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







Happy coding! 

