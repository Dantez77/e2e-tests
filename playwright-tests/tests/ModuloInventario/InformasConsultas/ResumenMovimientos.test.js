import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe.serial('Resumen de Movimientos', () => {
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
    await inventarioPage.goToInformesYconsultas(InventarioPage.INFORMES.RESUMEN_MOVIMIENTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar resumen de movimientos', async () => {
    await iframe.getByRole('textbox', { name: 'Producto' }).first().click();
    await iframe.getByRole('option', { name: /001/ }).click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    await iframe.getByRole('textbox', { name: 'Línea de producto' }).first().click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();
    await expect(iframe.getByText('100')).toBeVisible();
  });
});