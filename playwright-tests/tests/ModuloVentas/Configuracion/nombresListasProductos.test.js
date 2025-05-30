import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage.js';

test.describe.serial('Nombres de Listas de Productos', () => {
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
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.NOMBRES_LISTAS_PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  //DEJAR EN SKIP HASTA QUE SE PUEDAN ELIMINAR ITEMS DE ESTA LISTA
  test.skip('Agregar Lista', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Número de la lista' }).fill('9');
    await iframe.getByRole('textbox', { name: 'Nombre de la lista' }).fill('Lista Prueba');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test('Editar Lista', async () => {
    await iframe.getByRole('row', { name: 'Prueba' }).first().getByRole('button').first().click();
    await iframe.getByRole('textbox', { name: 'Nombre de la lista' }).fill('Lista Prueba Editada');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.getByRole('cell', { name: 'Lista Prueba Editada' })).toBeVisible();
    ;
  });

  test.skip('Eliminar Lista', async () => {
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await iframe.getByRole('row', { name: 'Prueba' }).first().getByRole('button').nth(1).click();
    
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
  });
});