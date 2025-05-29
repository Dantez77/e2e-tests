const { test, expect } = require('@playwright/test');
const credentials = require('../../../config/credentials.js');
const { login } = require('../../../helpers/login.js');

test.describe.serial('Retenciones IVA', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login
    await test.step('Login', async () => {
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    await page.getByRole('button', { name: 'Informes y consultas', exact: true }).click();
    await page.getByText('Retenciones 1% IVA').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar doc de retenciones IVA', async () => {
    // Probar salida PDF correcta del Libro de Compras
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();
    await iframe.getByRole('textbox', { name: 'Desde Fecha:' }).fill('2023-05-01');
    await iframe.getByRole('textbox', { name: 'Hasta Fecha:' }).fill('2023-05-31');

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();
    await expect(iframe.getByText('100', { exact: true })).toBeVisible();

    await page.waitForTimeout(200);
    await expect(iframe.getByText(/Error/i)).not.toBeVisible();
  });
});