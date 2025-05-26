const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

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
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloInventario' }).click();
    await page.getByRole('link', { name: 'Lineas de productos', exact: true }).click();
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