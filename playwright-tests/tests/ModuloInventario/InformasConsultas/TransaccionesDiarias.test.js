import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe('Transacciones Diarias', () => {
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
    await inventarioPage.goToInformesYconsultas(InventarioPage.INFORMES.TRANSACCIONES_DIARIAS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar transacciones diarias', async () => {
    await iframe.getByRole('textbox', { name: 'Tipo de movimiento' }).first().click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();
    await expect(iframe.getByText('100')).toBeVisible();
  });
});