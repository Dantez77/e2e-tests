const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Modulo Compras - Proveedores', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregando a tabla sin llenar los campos requeridos', async () => {
    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Proveedores Close' })).toBeVisible();

    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Check for required field messages
    await expect(iframe.locator('#parsley-id-7').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-17').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-19').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-27').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-37').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-41').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-45').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframe.locator('#parsley-id-51').getByText('Este valor es requerido.')).toBeVisible();
  });

  test('Agregar, Editar y Eliminar proveedor', async () => {
    const idProveedor = `PV-` + `${Date.now()}`.slice(-7);
    const nombreProveedor = `Proveedor ` + `${Date.now()}`.slice(-4);
    const nit = `${Date.now()}`.slice(-10);

    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();

    // Crear
    await test.step('Crear proveedor', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(idProveedor);
      await iframe.getByRole('textbox', { name: 'Tipo de persona' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Nombre' }).click();
      await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nombreProveedor);
      await iframe.locator('#dirprov').fill('calle 1, ciudad 1, pais 1');
      await iframe.getByRole('textbox', { name: 'Pais', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Teléfono:' }).fill('7XXX7XXX');
      await iframe.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
      await iframe.getByRole('button', { name: 'Grabar' }).click();

      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(idProveedor);
      await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toBeVisible();
    });

    // Editar
    await test.step('Editar proveedor', async () => {
      await iframe.getByRole('row', { name: idProveedor }).getByRole('button').first().click();
      await iframe.getByRole('textbox', { name: 'NIT' }).fill(nit);
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await expect(iframe.getByRole('cell', { name: nit, exact: true })).toBeVisible();
    });

    // Eliminar
    await test.step('Eliminar proveedor', async () => {
      await iframe.getByRole('row', { name: idProveedor }).getByRole('button').nth(1).click();
      await iframe.getByRole('button', { name: 'Eliminar' }).click();
      await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();
      await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
      //Verificando que ya no existe
      await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toHaveCount(0);
    });
  });
});