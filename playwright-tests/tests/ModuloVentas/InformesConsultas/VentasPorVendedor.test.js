import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage';

test.describe.serial('Ventas por vendedor', () => {
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
    await ventasPage.goToInformesYconsultas(VentasPage.INFORMES.VENTAS_POR_VENDEDOR); 
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Ventas por vendedor', async () => {
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();
    await iframe.getByRole('textbox', { name: 'Desde fecha' }).fill('2023-05-01');
    await iframe.getByRole('textbox', { name: 'Hasta fecha' }).fill('2023-05-31');

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();

    await expect(iframe.getByText('100', { exact: true })).toBeVisible();
  });
});