const { test, expect } = require('@playwright/test');
const { crearFactura } = require('@helpers/crearFactura');
const { busquedaDoc } = require('@helpers/busquedaDoc');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe.serial('Factura', () => {
  let page;
  let context;
  let iframe;
  let idFactura;

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
    const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
    await expect(ventasBtn).toBeVisible();
    await ventasBtn.click(); await page.getByRole('link', { name: 'Factura', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear un documento de facturación', async () => {
    idFactura = await crearFactura(page, iframe);
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número de documento' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(idFactura);
    await expect(iframe.getByRole('row', { name: idFactura })).toBeVisible();
  });

  test('Editar el documento de facturación', async () => {
    if (!idFactura) {
      idFactura = await crearFactura(page, iframe);
    }
    await iframe.getByRole('cell', { name: idFactura }).click();
    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    //Verificar que el documento fue editado
    await expect(
      iframe
        .getByRole('row', { name: idFactura })
        .getByRole('cell', { name: 'John Doe' }) // Cambiar John Doe por variable si es necesario
    ).toBeVisible();
  });

  test('Anular el documento de facturación', async () => {
    if (!idFactura) {
      idFactura = await crearFactura(page, iframe);
    }
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await iframe.getByRole('button', { name: 'Por número de documento' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(idFactura);
    await iframe.getByRole('button', { name: 'Buscar', exact: true }).click();
    await iframe
      .getByRole('row', { name: idFactura })
      .getByRole('cell', { name: 'John Doe' }).click();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  // Solo correr para limpiar la tabla de pruebas
  test.skip('Limpiar tabla', async () => {
    const serie = '17TS000F';
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await iframe.getByRole('row', { name: serie }).first().click();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    //await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });
});