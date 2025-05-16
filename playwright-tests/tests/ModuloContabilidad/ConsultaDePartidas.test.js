const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Consulta de Partidas', () => {
  let page;
  let context;
  let iframeElement;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

    // Login and navigate to Modulo Ventas
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const contabilidadBtn = page.getByRole('link', { name: 'btn-moduloContabilidad' });
      await expect(contabilidadBtn).toBeVisible();
      await contabilidadBtn.click();
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloContabilidad' }).click();
    await page.getByRole('link', { name: 'Consulta de partidas', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Test ...', async () => {
    //TODO:
  });
});