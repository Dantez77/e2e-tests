const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe.serial('Datos de la empresa', () => {
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
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByText('Datos de la empresa').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Observar que abre la pagina y se muestran todos los elementos', async () => {
    await expect(iframe.getByRole('listitem')).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Grabar' })).toBeVisible();
    await expect(iframe.getByRole('textbox', { name: 'Nombre de la empresa' })).toBeVisible();
  });
});