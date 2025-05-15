const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Comprobante de Donación', () => {
  let page;
  let context;
  let iframeElement;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Comprobante de donación', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Debe mostrar la pantalla de Comprobante de Donación', async () => {
    // TODO: 
  });
});