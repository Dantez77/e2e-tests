const { test, expect } = require('@playwright/test');
const credentials = require('../../../config/credentials.js');
const { login } = require('../../helpers/login.js');

test.describe.serial('Periodo de trabajo', () => {
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
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByText('Período de trabajo').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.skip('Configurar periodo de trabajo', async () => {
    //TODO; Opcion esta deshabilitada en el entorno actual
  });
});