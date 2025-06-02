import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe.serial('Marcas de producto', () => {
  let page;
  let context;
  let iframe;
  const randomID = `${Date.now()}`.slice(-9);

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
    await inventarioPage.goToSubModule(InventarioPage.MAIN.MARCAS_DE_PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear marca de producto', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).fill(randomID);
    await iframe.getByRole('textbox', { name: 'Nombre de la marca' })
      .fill('Marca ' + randomID.slice(-4));
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Modificar marca de producto', async () => {
    const nomMarca = 'Marca modificada ' + randomID.slice(-4);
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('cell', { name: randomID })).toBeVisible();
    await iframe.getByRole('row', { name: randomID }).getByRole('button').nth(0).click();

    await iframe.getByRole('textbox', { name: 'Nombre de la marca' }).fill(nomMarca);
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('row', { name: randomID })
      .getByRole('cell', { name: nomMarca }))
      .toBeVisible();
  });

  test('Eliminar marca de producto', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill(randomID);
    await expect(iframe.getByRole('cell', { name: randomID })).toBeVisible();
    await iframe.getByRole('row', { name: randomID }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await iframe.getByRole('button', { name: 'Si - Aceptar' }).click();
  });
});