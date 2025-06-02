import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('Modulo Compras - Proveedores', () => {
  let page;
  let context;
  let iframe;
  const idProveedor = `PV-` + `${Date.now()}`.slice(-7);
  const nombreProveedor = `Proveedor ` + `${Date.now()}`.slice(-4);

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
    await comprasPage.goToSubModule(ComprasPage.MAIN.PROVEEDORES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregando a tabla sin llenar los campos requeridos', async () => {
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

  test('Agregar proveedor', async () => {
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

  test('Editar proveedor', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(idProveedor);
    await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toBeVisible();

    await iframe.getByRole('row', { name: idProveedor }).getByRole('button').first().click();
    await iframe.getByRole('textbox', { name: 'Teléfono:' }).fill('7777-7777');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.getByRole('row', { name: idProveedor })
      .getByRole('cell', { name: '7777-7777' }))
      .toBeVisible();
    //await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Eliminar proveedor', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(idProveedor);
    await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toBeVisible();

    await iframe.getByRole('row', { name: idProveedor }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
    await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toHaveCount(0);
  });
});