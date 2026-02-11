# Test Execution – Frontend (Angular)

## Overview

I test del frontend sono suddivisi in:

- **Unit / Component / Service test**: eseguiti con **Karma + Jasmine** (`ng test`)
- **Lint / typecheck** (consigliato): per qualità del codice e individuazione rapida di regressioni
- **E2E (opzionale)**: se presenti (**Cypress / Playwright**) per la validazione dei flussi end-to-end

> **Nota**  
> I test Angular possono essere eseguiti in modalità **headless**, quindi sono adatti sia a **GitHub Actions** sia all’esecuzione **locale**.

---

## Test presenti

### Route test

**File**
- `dashboards/dashboard.routing.spec.ts`
- `routing-module/routing-module.module.spec.ts`

**Osservazioni**

I test sulle rotte sono limitati.

Non vengono verificate:
- configurazione completa delle rotte
- guard (`AuthGuard`, `LoginActivate`, `NgxPermissionsGuard`)
- rotte lazy-loaded
- rotte con parametri
- fallback / not-found

---

### Component test

Totale **59 component test**, distribuiti su:

- Componenti funzionali (anagrafica, pagamenti, quadri, dashboard, ecc.)
- Componenti shared (layout, sidebar, navbar, dialog)
- Home e not-found

**Esempi**
- `app.component.spec.ts`
- `home/home.component.spec.ts`
- `navbar/navbar.component.spec.ts`
- `components/**/**.component.spec.ts`
- `shared/**/**.component.spec.ts`

La maggior parte dei test verifica correttamente la **creazione del componente**

---

### Service test

Totale **44 service test** (copertura molto alta).

**Esempi**
- `anagrafica.service.spec.ts`
- `permission.service.spec.ts`
- `role.service.spec.ts`
- `session-storage.service.spec.ts`
- `pagamento.service.spec.ts`
- `storyProcess.service.spec.ts`
- `quadro-riepilogativo.service.spec.ts`

Area meglio coperta del progetto.

### Moduli
- `core/core.module.spec.ts`

---

## Test Frontend Eseguibili su GitHub Actions

### Requisiti
- Node.js (versione allineata alla pipeline del progetto)
- Dipendenze installate (`npm ci` o `yarn install --frozen-lockfile`)
- Chrome / Chromium disponibile (generalmente già presente sugli runner GitHub)

### Esecuzione (Unit Test)

```bash
cd unicontract-frontend
npm ci
npx ng test --watch=false --browsers=ChromeHeadless
```

### Esecuzione con Coverage

```bash
cd unicontract-frontend
npm ci
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

**Output atteso (default Angular)**
- `coverage/<nome-progetto>/index.html`
- `coverage/<nome-progetto>/lcov.info`

---

## Esecuzione Locale (Frontend)

### Preparazione

```bash
cd unicontract-frontend
npm ci
```

### Unit test in modalità interattiva

```bash
npx ng test
```

### Unit test headless (stile CI)

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

### Coverage locale

```bash
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

---

## Integrazione Frontend nella CI/CD

Per ottenere una pipeline **frontend** in **GitHub Actions**, lo schema tipico è:

1. Setup Node.js
2. Installazione dipendenze frontend
3. Esecuzione test frontend (`ng test` headless)
4. *(Opzionale)* pubblicazione artifact di coverage (frontend)

Vedi .github/workflows/angular-tests.yml per i dettagli.

### Esempio – Step Frontend in pipeline CI

```bash
cd unicontract-frontend
npm ci
npx ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

---


