import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { login } from '@helpers/login.js';

test.describe('Grupos de Clientes', () => {
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
    await page.getByRole('link', { name: 'Grupos de clientes', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Debe mostrar la pantalla de Grupos de Clientes', async () => {
    // TODO
  });
});