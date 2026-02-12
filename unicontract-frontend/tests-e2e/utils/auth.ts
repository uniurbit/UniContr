import { Page } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'tokenunicontr';
const TOKEN_TEST =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInJvbGVzIjpbIkFETUlOIl0sImRpcHMiOltdfQ.' +
  'dummy-signature';

export function getBearerTokenFromEnv(): string {
  const token = process.env.E2E_BEARER_TOKEN || TOKEN_TEST;

  if (!token) {
    throw new Error(
      'E2E_BEARER_TOKEN non impostato. Imposta la variabile d’ambiente prima di eseguire i test.'
    );
  }

  return token;
}

export async function injectBearerToken(page: Page): Promise<void> {
  const token = getBearerTokenFromEnv();
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: TOKEN_STORAGE_KEY, value: token }
  );
}
