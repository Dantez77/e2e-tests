import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe.serial('Libro de compras', () => {
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
    const comprasPage = new ComprasPage(page);
    await comprasPage.goToInformesYconsultas(ComprasPage.INFORMES.LIBRO_DE_COMPRAS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar doc de libro de compras', async () => {
    // Probar salida PDF correcta del Libro de Compras
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();
    await iframe.getByRole('textbox', { name: 'Desde Fecha:' }).fill('2023-05-01');
    await iframe.getByRole('textbox', { name: 'Hasta Fecha:' }).fill('2023-05-31');

    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();
    await expect(iframe.getByText('100', { exact: true })).toBeVisible();
  });
});