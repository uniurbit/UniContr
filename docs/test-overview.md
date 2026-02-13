<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Testing Overview

Il progetto UniContr ha test separati per:

- Backend (PHPUnit)
- Frontend (Angular Karma/Jasmine)

---

## Classificazione Test

### CI-safe
- Nessuna chiamata reale a servizi esterni
- Nessuna dipendenza da credenziali esterne
- Deterministici
- Eseguibili su GitHub Actions

### Integration / External
- Chiamano servizi reali (UGOV, Titulus, FirmaIO)
- Possono generare side effect
- Da eseguire solo in ambienti controllati