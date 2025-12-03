<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# Installazione

## Backend Laravel
1. `cd unicontr-backend`
2. Copiare `.env.example` in `.env` e configurare
3. `composer install`
4. Generare certificati e copiarli in `vendor/onelogin/php-saml/certs/`
5. `php artisan migrate:fresh --seed`

## Frontend Angular
1. `cd unicontr-frontend`
2. `npm install`
3. `ng serve`

## Mock IdP
1. `cd unicontr-mock-idp`
2. `npm install fake-sso-idp`
3. `node start.js`

Aprire il browser su `http://localhost:4200/`
