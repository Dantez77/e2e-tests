const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');
const { LoginPage } = require('../../../POM/loginPage.js');
const { VentasPage } = require('../../../POM/ventasPage.js');

test.describe.serial('Monedas y tasas de cambio', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login
    await test.step('Login', async () => {
      const login = new LoginPage(page);
      await login.login(credentials);
    });
  });

  test.beforeEach(async () => {
    const ventasPage = new VentasPage(page);
    await ventasPage.goToMonedasYtasaCambio();

    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Monedas y tasas de cambio', async () => {
    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();

  });
});