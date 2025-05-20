const { test, expect } = require('@playwright/test');
const { crearFactura } = require('../helpers/crearFactura');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Factura', () => {
  let page;
  let context;
  let iframe;
  let idFactura;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login and navigate to "Modulo Ventas"
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  test.beforeEach(async () => {
    // Navigate to "Factura" section
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Factura', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    // Clean up resources
    await page.close();
    await context.close();
  });

  test('Debe crear un documento de facturación', async () => {
    idFactura = await crearFactura(page, iframe);
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número de documento' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(idFactura);
    await expect(iframe.getByRole('row', { name: idFactura })).toBeVisible();
  });

  test('Debe editar el documento de facturación', async () => {
    // Si el documento no existe, créalo primero
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

  test('Debe anular el documento de facturación', async () => {
    // Si el documento no existe, créalo primero
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
    await page.waitForTimeout(500);
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });
});