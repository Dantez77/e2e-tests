import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { VentasPage } from '@POM/ventasPage';

test.describe('Vendedores', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login 
    await test.step('Login', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.login(credentials);
    });
  });

  test.beforeEach(async () => {
    const ventasPage = new VentasPage(page);
    await ventasPage.goToSubModule(VentasPage.MAIN.VENDEDORES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Debe mostrar la pantalla de Vendedores', async () => {
    await expect(iframe.getByRole('heading', { name: /Vendedores/i })).toBeVisible();
    // TODO: Implementar fucionalidad
  });
});