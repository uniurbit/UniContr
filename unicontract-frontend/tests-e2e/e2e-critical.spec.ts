import { test, expect } from '@playwright/test';
import { injectBearerToken } from './utils/auth';

test.describe('E2E Critical Path', () => {

  // Gruppo test autenticati
  test.describe('Autenticazione e Layout', () => {
    test.beforeEach(async ({ page }) => {
      await injectBearerToken(page);
    });

    test('Navbar e Sidebar visibili dopo login', async ({ page }) => {
      await page.goto('/home');

      // Navbar top
      await expect(page.locator('nav.navbar.top-navbar')).toBeVisible({ timeout: 5000 });

      // Sidebar
      await expect(page.locator('nav.sidebar-nav')).toBeVisible({ timeout: 5000 });
    });

    test('Routing: navigazione verso /lista-precontr-query', async ({ page }) => {
      await page.goto('/home/lista-precontr-query');

      // Verifica heading principale
      const heading = page.getByRole('heading', { name: /Lista precontrattuali/i });
      await expect(heading).toBeVisible({ timeout: 5000 });
      
    });
  });

  // Test non autenticati / pagine pubbliche
  test.describe('Accesso pubblico e errori', () => {

    test('Pagina inesistente → mostra componente Not Found', async ({ page }) => {
     await page.goto('/questa-rotta-non-esiste-12345');

      // Controlla messaggio visibile
      await expect(
        page.getByText(/SPIACENTE, QUESTA SEZIONE È PRIVA DI CONTENUTI|not found|404/i)
      ).toBeVisible({ timeout: 5000 });
    });

    test('Se non autenticato redirige a SSO', async ({ page }) => {
      await page.goto('/home');
      await expect(page).toHaveURL(/\/sso\?SAMLRequest=/i, { timeout: 5000 });
    });
  });
});
