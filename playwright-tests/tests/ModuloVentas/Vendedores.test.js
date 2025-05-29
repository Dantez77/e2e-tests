const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('Vendedores', () => {
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
    await page.getByRole('link', { name: 'Vendedores', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Debe mostrar la pantalla de Vendedores', async () => {
    await expect(iframeElement.getByRole('heading', { name: /Vendedores/i })).toBeVisible();
    // TODO:
  });
});