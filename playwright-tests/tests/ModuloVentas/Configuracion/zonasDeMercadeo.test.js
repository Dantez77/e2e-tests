const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');
const { LoginPage } = require('@POM/loginPage.js');
const { VentasPage } = require('@POM/ventasPage.js');
const { randomUUID } = require('crypto');

test.describe.serial('Zonas de Mercadeo', () => {
  let page;
  let context;
  let iframe;
  const uniqueId = randomUUID().slice(-4);

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
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.ZONAS_DE_MERCADEO);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  // No se pueden eliminar. Habilitar una vez ya se pueda
  test.fixme('Agregar zona de mercadeo', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Nombre de la zona' }).fill('Zona Prueba');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test.fixme('Editar zona de mercadeo', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
    await iframe.getByRole('textbox', { name: 'Nombre de la zona' }).fill('Zona Prueba Editada3');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.getByRole('row', { name: uniqueId })
      .getByRole('cell', { name: 'Zona Prueba Editada3' }))
      .toBeVisible();
  });

  test.fixme('Eliminar zona de mercadeo', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await iframe.getByRole('button', { name: 'Aceptar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro eliminado');
  });

});