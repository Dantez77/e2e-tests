const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe.serial('Retaceo polizas', () => {
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
    await page.getByText('Retaceo de póliza de importación').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Generar doc de retaceo de póliza de importación', async () => {
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();

    await iframe.getByRole('textbox', { name: '# de Poliza:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();
    await expect(iframe.getByText('100', { exact: true })).toBeVisible();
  });
});