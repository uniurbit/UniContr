<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# UniContr – Documentazione Completa

Questa cartella contiene tutta la documentazione tecnica dell'applicazione **UniContr** sotto licenza **Creative Commons CC-BY 4.0**.

UniContr è un'applicazione web per la **proceduralizzazione e dematerializzazione dei contratti di docenza**.  
L'applicazione utilizza **Web API**, con **Laravel** per il backend, **Angular** per il frontend e **Shibboleth** come sistema di autenticazione.

---

## 📑 Sommario

- Panoramica del Progetto 
- Funzionalità Applicative 
- Moduli / Struttura Precontrattuale  
- Caratteristiche del Sistema 
- Licenza

---

## 🏗 Panoramica del Progetto

- [Panoramica del progetto](panoramica.md)  
- [Installazione e Avvio](installazione.md)  
- [Frontend – Struttura progetto Angular](frontend.md)  
- [Backend – Struttura progetto Laravel](backend.md)  
- [Documentazione API](api.md)  

---

## ⚡ Funzionalità Applicative

- 🔥 **Gestione delle precontrattuali:** inserimento, modifica e validazione  
- 🔥 **Storico precontrattuali**  
- 🔥 **Dashboard uffici**  
- 🔥 **Generazione contratto** (PDF/A)  
- 🔥 **Notifiche a uffici e docenti**  
- Richiesta compilazione modulistica precontrattuale  
- Avvenuta compilazione modulistica  
- Richiesta modifiche/integrazioni  
- Visione e accettazione contratto di docenza UniUrb  
- Avvenuta accettazione contratto di insegnamento  
- Report mensile per dipartimento  
- Solleciti per visionare/accettare contratti  
- 🔥 **Firma dei contratti**  

---

## 📂 Moduli / Struttura Precontrattuale

- [Navigazione e Funzionalità](schermate.md) – Descrizione delle schermate principali e funzionalità dell'applicazione  

La struttura dei moduli segue la gerarchia dei dati da compilare:

### ⚡ Dati insegnamento e posizione collaboratore
- **P.1** – Dati insegnamento (importati da Ugov)  
- **P.2** – Posizione collaboratore e natura del rapporto  

### ⚡ Dati anagrafici e di posizione
- **A.1** – Dati anagrafici  
- **A.2** – Modalità di pagamento e dati conto corrente  

### 📄 Modelli B – Dichiarazioni
- **B.1** – Conflitto interessi  
- **B.2** – Incompatibilità  
- **B.3** – Rapporto studio/lavoro con Università  
- **B.4** – Rapporto con Pubblica Amministrazione  
- **B.5** – Stato di pensionamento  
- **B.6** – Trattamento dati e privacy  

### ⚡ Dati fiscali, tributari e previdenziali
- **C** – Prestazione Professionale  
- **D** – Collaborazioni autonome
  - D.1 – Previdenziali  
  - D.2 – Assicurativi INAIL  
  - D.3 – Tributari  
  - D.4 – Fiscali  
  - D.5 – Fiscali residenti estero  
  - D.6 – Detrazioni familiari  
- **E** – Lavoro autonomo occasionale  

---

## 💻 Caratteristiche del Sistema

- 🔥 Architettura Web API  
- ⚡ Supporto SSO con Shibboleth  
- ⚡ Integrazione lettura dati Ugov  
- ⚡ Integrazione Titulus  
- ⚡ Integrazione firma con **IO** e **U-Sign**  
- 📝 Multi utente e multi ruolo  
- 📝 Generazione PDF tramite **mpdf**  
- 😍 Tema **Bootstrap**  
- 💪 Tecnologie principali: Laravel, Angular, Dynamic Forms Angular  

---

## 📜 Licenza

Tutta la documentazione è sotto **[Creative Commons CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.  
Puoi condividere e adattare il contenuto citando la fonte.
