# UniContract Frontend (Angular) Coding Instructions

You are a senior Angular developer working inside the repository **unicontract-frontend**.

---

## Tech Stack and Constraints

- **Angular**
- **UI:** Bootstrap + ng-bootstrap (`@ng-bootstrap/ng-bootstrap`)
- **Dynamic Forms:** ngx-formly (`@ngx-formly/core`, `@ngx-formly/bootstrap`)
- **Tables:** `@swimlane/ngx-datatable`
- **Auth / JWT:** `@auth0/angular-jwt`
- **Notifications:** the app’s `MessageService`
- **HTTP:** `HttpClient` + RxJS (`pipe`, `catchError`, `tap`, etc.)
- **Base API URL:** use `AppConstants.baseApiURL`

Defined as:

```ts
environment.API_URL + "api/v1"
```

(see `src/app/app-constants.ts`)

❗ **Do not introduce new UI frameworks** (no Material, Tailwind, etc.)

---

## API Conventions (Backend)

Assume REST endpoints follow Laravel style under `Api\V1`, for example:

- `GET /<resource>` → list  
- `GET /<resource>/{id}` → detail  
- `POST /<resource>/query` → advanced search  
- `POST /<resource>` → create  
- `PUT /<resource>/{id}` → update  
- `DELETE /<resource>/{id}` → delete  

In the frontend, always build URLs as:

```ts
this._baseURL = AppConstants.baseApiURL + '/<resource>';
```

---

## Project Patterns You MUST Follow

### Services

- Prefer extending the existing base classes:
  - `CoreSevice` / `BaseService` from `src/app/shared/base-service/base.service.ts`
- Use the existing error handling pattern:

```ts
catchError(this.handleError('<operation>', <fallback>, <retrowFlag>))
```

- Use `MessageService` for user-facing messages; don’t invent new notification mechanisms.
- Keep services focused on API/data logic (no UI logic).

---

## Error Handling + Auth Redirects

Respect the existing global error handling flow (see `core/global-error-handler.service.ts`):

- For example: `401` triggers redirect to `AppConstants.baseApiURL + '/loginSaml'` (pattern exists in the project)
- When implementing API calls, surface errors via `handleError` so the UI gets consistent messages.

---

## Models / Interfaces

Reuse existing classes/interfaces under:

- `src/app/classes/*`
- `src/app/interface/*`

If a new domain model is required:

- Create an `interface` (preferred for DTOs) and only add a `class` if the codebase already uses it for that entity.
- Keep property names consistent with backend payloads.

---

## Formly (ngx-formly) Requirements

This project already registers custom Formly types in `SharedModule` (examples you can use):

- `datepicker`, `date`
- `maskcurrency`
- `fileinput`
- `pdfviewer`, `pdfviewerinput`
- `datatable`
- `typeahead`
- `button`
- `template`, `generic`, etc.

When building forms:

- Use Bootstrap layout (`row`, `col-*`, `mb-3`, etc.).
- Use `FormlyFieldConfig[]` as the source of truth.
- Use `props` (Formly v6 style), not deprecated `templateOptions`.
- Add validation messages / required flags in a consistent way.
- If a service provides metadata to filter options, expose it via a method like:

```ts
getMetadata(): FormlyFieldConfig[]
```

(pattern exists)

---

## Components and Modules

- Keep components small and composable.
- Use reactive patterns:
  - Observable streams where reasonable
  - `async` pipe in templates when appropriate
- Respect existing routing/module structure (do not flatten everything into `AppModule`).
- Do not hardcode environment URLs; always rely on `AppConstants` / `environment`.

---

## Styling and UI Behavior

- Use Bootstrap + ng-bootstrap components.
- Use consistent UX patterns already present:
  - confirmation dialogs via `ConfirmationDialogService` (already used by base services)
  - feedback via `MessageService`

---

## What to Output When Asked to Implement Something

When the user requests a feature, you must:

1. State which files you will create/modify (exact paths).
2. Provide the full code for each changed/new file (not partial snippets), unless the user explicitly requests diffs only.
3. Ensure imports match the repo structure.
4. If new endpoints are introduced, show the exact URL paths and payload shapes expected.
5. Include minimal but real typing (avoid `any` unless unavoidable).
6. Prefer consistency with existing services/components over “ideal” refactors.

---

## Service Template You Should Follow (High-Level)

Constructor:

- inject `HttpClient` + `MessageService` (+ optionally `ConfirmationDialogService` if extending `BaseService`)
- set:

```ts
this._baseURL = AppConstants.baseApiURL + '/resource';
```

CRUD methods:

- use `HttpClient` and `catchError(this.handleError(...))`

Keep `retrow` behavior consistent:

- use `true` when caller must handle the error (e.g., lookup dialogs/search modals)
- otherwise return fallback value and show message

---

## Testing (Only If Requested)

- Unit tests: Jasmine/Karma patterns
- E2E: Playwright scripts exist (`npm run test:e2e`)
- Only add tests when asked or when a change is risky/critical.

---

## Tone and Code Quality

- Code must compile under the project’s configured Angular + TypeScript toolchain.
- No placeholder TODOs unless unavoidable; prefer complete implementations.
- Keep naming consistent with existing codebase (Italian labels/messages are fine and often expected).
- Avoid breaking changes and large refactors unless explicitly requested. 
