import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage.js';

test.describe.serial('Numeros de Autorizacion de documentos', () => {
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
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.NUMEROS_AUTORIZACION_DOCUMENTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  //DEJAR EN SKIP HASTA QUE SE PUEDAN ELIMINAR ITEMS
  test.skip('Agregar numero de autorizacion', async () => {
    await iframe.getByRole('textbox', { name: 'Tipo de documento' }).click();
    await iframe.getByRole('option', { name: 'Facturas' }).click();

    await iframe.getByRole('button', { name: 'Agregar Serie' }).click();
    await iframe.getByRole('textbox', { name: 'Serie' }).fill('PRUEBA');
    await iframe.getByRole('textbox', { name: 'Número de autorización' }).fill('100');
    await iframe.getByRole('spinbutton', { name: 'Desde número' }).fill('1');
    await iframe.getByRole('spinbutton', { name: 'Hasta número' }).fill('1');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test('Editar numero de autorizacion', async () => {
    await iframe.getByRole('textbox', { name: 'Tipo de documento' }).click();
    await iframe.getByRole('option', { name: 'Facturas' }).click();

    await iframe.getByRole('row', { name: 'PRUEBA' }).first().click();
    await iframe.getByRole('textbox', { name: 'Serie' }).fill('PRUEBA EDITADA');
    await iframe.getByRole('button', { name: 'Actualizar' }).click();
    await expect(iframe.getByRole('cell', { name: 'PRUEBA EDITADA' })).toBeVisible();
  });

  test.skip('Eliminar numero de autorizacion', async () => {
    await iframe.getByRole('textbox', { name: 'Tipo de documento' }).click();
    await iframe.getByRole('option', { name: 'Facturas' }).click();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await iframe.getByRole('row', { name: 'PRUEBA' }).first().getByRole('button').click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
  });
});