import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe.serial('Lineas de productos', () => {
  let page;
  let context;
  let iframe;
  const randomID = `${Date.now()}`.slice(-6);

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
    const inventarioPage = new InventarioPage(page);
    await inventarioPage.goToSubModule(InventarioPage.MAIN.LINEAS_DE_PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear linea de producto', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).first().fill(randomID);
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill('Linea ' + randomID.slice(-4));
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Modificar linea de producto', async () => {
    const nomLinea = 'Linea modificada ' + randomID.slice(-4);
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('cell', { name: randomID })).toBeVisible();
    await iframe.getByRole('row', { name: randomID }).getByRole('button').nth(0).click();

    await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nomLinea);
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('row', { name: randomID })
      .getByRole('cell', { name: nomLinea }))
      .toBeVisible();
  });

  test('Eliminar linea de producto', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('cell', { name: randomID })).toBeVisible();
    await iframe.getByRole('row', { name: randomID }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro eliminado');
  });
});