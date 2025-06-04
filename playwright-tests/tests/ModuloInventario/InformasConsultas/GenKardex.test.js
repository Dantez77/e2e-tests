import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe('Resumen de Movimientos', () => {
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
    const inventarioPage = new InventarioPage(page);
    await inventarioPage.goToInformesYconsultas(InventarioPage.INFORMES.KARDEX);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar kardex', async () => {
    await iframe.getByRole('button', { name: 'Generar Pdf' }).click();
    await expect(iframe.getByText('Inicio del proceso')).toBeVisible();
  });
});