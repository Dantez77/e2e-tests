const { test, expect } = require('@playwright/test');
const credentials = require('../../../config/credentials.js');
const { login } = require('../../helpers/login.js');

test.describe.serial('Generar CSE de nómina honorarios', () => {
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
    await page.getByText('Generar CSE de nómina honorarios').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Generar CSE de nómina honorarios', async () => {
    //TODO: No tengo disponibles los parametros para realizar un test de esta funcion
  });
});