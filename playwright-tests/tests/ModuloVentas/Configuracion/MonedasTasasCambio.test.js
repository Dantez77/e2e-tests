const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { LoginPage } = require('@POM/loginPage.js');
const { VentasPage } = require('@POM/ventasPage.js');

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
      const loginPage = new LoginPage(page);
      await loginPage.login(credentials);
    });
  });

  test.beforeEach(async () => {
    const ventasPage = new VentasPage(page);
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.MONEDA_TASA_CAMBIO);
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