const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { LoginPage } = require('@POM/loginPage.js');
const { VentasPage } = require('@POM/ventasPage.js');

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
      const loginPage = new LoginPage(page);
      await loginPage.login(credentials);
    });
  });

  test.beforeEach(async () => {
    const ventasPage = new VentasPage(page);
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.DATOS_DE_LA_EMPRESA);
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