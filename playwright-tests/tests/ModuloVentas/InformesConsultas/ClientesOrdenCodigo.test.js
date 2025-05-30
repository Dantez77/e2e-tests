const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { LoginPage } = require('@POM/loginPage.js');
const { VentasPage } = require('@POM/ventasPage');

test.describe.serial('Clientes en orden de código', () => {
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
    await ventasPage.goToInformesYconsultas(VentasPage.INFORMES.CLIENTES_POR_CODIGO); 
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Lista de clientes por codigo', async () => {
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();

    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();

    await expect(iframe.getByText('100', { exact: true })).toBeVisible();
  });
});