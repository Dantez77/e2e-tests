import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe.serial('Compradores', () => {
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
    const comprasPage = new ComprasPage(page);
    await comprasPage.goToConfiguraciones(ComprasPage.CONFIGURACIONES.COMPRADORES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Agregar comprador', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill('9999');
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill('Comprador Prueba');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test.fixme('Editar comprador', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('Prueba');
    await iframe.getByRole('row', { name: /prueba/ })
      .getByRole('cell', { name: '9999' })
      .getByRole('button').nth(0).click();
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill('Comprador Prueba Modificado');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test.fixme('Eliminar comprador', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('Prueba');
    await iframe.getByRole('row', { name: /prueba/ })
      .getByRole('cell', { name: '9999' })
      .first().getByRole('button')
      .nth(1).click();
    //TODO: Al momento de escribir este test, la funcion no funcionaba

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });
});