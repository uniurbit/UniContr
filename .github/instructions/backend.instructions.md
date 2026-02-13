# Laravel (PHP) Backend Coding Instructions (API + Database)

You are writing code for a Laravel backend application in PHP that
exposes a REST API and uses a relational database via Eloquent ORM +
migrations.

------------------------------------------------------------------------

## General Rules

-   Follow existing project structure, naming, and patterns already used
    in the codebase.
-   Keep changes minimal and consistent with current conventions.
-   Prefer readable, maintainable code over cleverness.
-   Avoid introducing new architectural layers unless the project
    already uses them.

------------------------------------------------------------------------

## API Design Conventions

-   Build endpoints as RESTful resources where possible:
    -   `index`, `show`, `store`, `update`, `destroy`
-   Use clear, consistent route naming (`/resources`,
    `/resources/{id}`).
-   Keep controllers thin when possible; move reusable business logic
    into Services if the codebase already uses Services.

------------------------------------------------------------------------

## Responses and Errors

-   Return JSON responses using either:
    -   `return response()->json($data, $statusCode);`
    -   or the existing response style used in the codebase.
-   Use correct HTTP status codes:
    -   `200` OK, `201` Created, `204` No Content
    -   `400` Bad Request, `401` Unauthorized, `403` Forbidden
    -   `404` Not Found, `422` Validation Error, `500` Server Error
-   For validation failures, return Laravel validation errors (422)
    consistently.

------------------------------------------------------------------------

## Authentication and Authorization

-   Respect the existing auth approach in the project (guards,
    JWT/session, API keys, etc.).
-   Protect sensitive endpoints with middleware (auth + role/permission
    checks) as used in the project.
-   Never bypass middleware or weaken access control.
-   Always verify ownership/authorization when accessing records by ID.

------------------------------------------------------------------------

## Validation and Input Handling

-   Validate every request that writes data (`store`, `update`) using:
    -   `$request->validate([...])` or `Validator::make(...)` depending
        on existing project style.
-   Validate existence of foreign keys (`exists:table,id`) where needed.
-   Prevent mass assignment issues:
    -   Use `$fillable` correctly or assign fields explicitly.
-   Never trust client-supplied IDs without checking access and
    existence.

------------------------------------------------------------------------

## Database and Migrations

-   Use migrations for schema changes:
    -   Create new migrations for new
        tables/columns/indexes/constraints.
-   Prefer Eloquent for CRUD; use Query Builder for complex queries if
    appropriate.
-   For multi-step writes (creating/updating multiple tables), wrap
    operations in a DB transaction:
    -   `DB::beginTransaction() / commit() / rollBack()` or
        `DB::transaction(...)`.
-   Add indexes for columns used in filters/joins where appropriate.

------------------------------------------------------------------------

## Eloquent Modeling

-   Define relationships (`hasOne`, `hasMany`, `belongsTo`,
    `belongsToMany`) when it helps readability.
-   Use eager loading (`with(...)`) to avoid N+1 queries for list
    endpoints.
-   Keep query scopes (`scope...`) for commonly reused filters.

------------------------------------------------------------------------

## Logging and Observability

-   If the project has logging/auditing patterns, follow them.
-   Log meaningful events for significant operations
    (create/update/delete), but avoid logging sensitive data.

------------------------------------------------------------------------

## What to Output When Implementing a Feature

When asked to implement something, provide:

1)  Route changes (file + exact additions)
2)  Controller code (new/updated methods)
3)  Model changes (fillable/relations/casts) if needed
4)  Migration(s) if schema changes are required
5)  Service changes if reusable logic is involved
6)  Notes on auth middleware / permissions used

------------------------------------------------------------------------

## Don'ts

-   Don't introduce breaking changes to existing APIs without explicitly
    requested.
-   Don't add new dependencies unless required and consistent with the
    project.
-   Don't change authentication strategy.
-   Don't assume database tables/columns exist---confirm and align with
    current schema.
-   Don't add placeholder TODOs; prefer complete implementations when
    possible, or clearly indicate what is left to do if something cannot be completed in one step.
-   Don't write code that won't run or compile under the project's current Laravel/PHP version and coding standards. Always ensure your code is syntactically correct and       follows the project's style guidelines. 