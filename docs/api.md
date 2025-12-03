<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# API REST Laravel – UniContr

Questa documentazione descrive gli endpoint disponibili nell'applicazione UniContr. Tutte le API seguono il namespace `Api\V1` e sono protette da middleware per autenticazione, CORS, logging e autorizzazioni.

---

## Gruppo Super-Admin

**Middleware:** `cors`, `auth.api`, `log`, `role:super-admin`, `check`

### Mapping Ruoli
- `GET /api/mappingruoli` → lista
- `GET /api/mappingruoli/{id}` → dettaglio
- `POST /api/mappingruoli/query` → ricerca avanzata
- `POST /api/mappingruoli` → crea
- `PUT /api/mappingruoli/{id}` → aggiorna
- `DELETE /api/mappingruoli/{id}` → cancella

### Users
- `GET /api/users` → lista utenti
- `POST /api/users/query` → ricerca
- `POST /api/users` → crea
- `PUT /api/users/{id}` → aggiorna
- `DELETE /api/users/{id}` → elimina
- `GET /api/users/roles` → ruoli
- `GET /api/users/permissions` → permessi
- `GET /api/users/{id}` → dettaglio

### Roles
- `GET /api/roles` → lista
- `GET /api/roles/{id}` → dettaglio
- `POST /api/roles/query` → ricerca
- `POST /api/roles` → crea
- `PUT /api/roles/{id}` → aggiorna
- `DELETE /api/roles/{id}` → cancella

### Permissions
- `GET /api/permissions` → lista
- `GET /api/permissions/{id}` → dettaglio
- `POST /api/permissions/query` → ricerca
- `POST /api/permissions` → crea
- `PUT /api/permissions/{id}` → aggiorna
- `DELETE /api/permissions/{id}` → cancella

---

## Gruppi con altri middleware

**Middleware:** `cors`, `auth.api`, `log`, `check`

- `POST /api/mappinguffici/query`
- `POST /api/notifiche/query`

**Middleware:** `cors`, `auth:api`, `log`

### Docente
- `POST /api/docente` → crea docente
- `GET /api/docente/{id}` → dettaglio docente

### Precontrattuale
- `GET /api/precontrattuale` → lista
- `POST /api/precontrattuale` → crea
- `PUT /api/precontrattuale/{id}` → aggiorna
- `POST /api/precontrattuale/query` → ricerca
- `POST /api/precontrattuale/…` → varie azioni specifiche (firma, export, validazione)

### Insegnamenti
- `GET /api/insegnamenti/{id}`
- `POST /api/insegnamenti`
- `PUT /api/insegnamenti/{id}`
- `POST /api/insegnamenti/query`
- `GET /api/insegnamenti/sendfirstemail/{id}`

### …Altri endpoint
- Rapporto, Anagrafica, Pagamento, Conflitto Interessi, Incompatibilità, Privacy, Prestazioni Professionali, Dati Fiscali/INAIL/INPS, Story Process, Mail list, Validazioni, Strutture interne/esterne, Unità organizzative, etc.

---

> Nota: La documentazione completa può essere generata automaticamente tramite `php artisan api:update`.

