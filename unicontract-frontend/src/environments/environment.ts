// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://127.0.0.1:80/', //'http://pcoliva.uniurb.it/',
  baseHref: '/',
  whitelistedDomains: ['localhost:4200','pcoliva.uniurb.it','127.0.0.1:80'],
  blacklistedRoutes: ['localhost:4200/auth/'],
  documentation: ''
};

