const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Compras Locales', () => {
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

  test('Agregar item a Productos', async () => {
    const uniqueId = `P-` + `${Date.now()}`.slice(-7);
    const producto = `Producto ` + `${Date.now()}`.slice(-4);

    await page.getByRole('link', { name: 'Productos', exact: true }).click();

    await test.step('Agregando el item a la tabla', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframe.getByRole('textbox', { name: 'Descripcion', exact: true }).fill(producto);
      await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByText('NoSí').first().click();
      await iframe.getByText('NoSí').nth(2).click();
      await iframe.getByText('NoSí').nth(1).click();
      await iframe.getByText('Contables').click();
      await iframe.getByRole('textbox', { name: 'Concepto de gastos de importación' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByText('Precios').click();
      await iframe.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('20');
      await iframe.getByRole('spinbutton', { name: 'Precio 2 SIN IVA' }).fill('22');
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();
    });
  });

  test('Borrar elementos del registro', async () => {
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframe.locator('[role="option"][data-index="1"]');
    const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
    await optionLocator.click();
    await iframe.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('100');
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframe.locator('#btnConfirmAddLine').click();
    await expect(iframe.getByRole('cell', { name: value })).toBeVisible();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await iframe.getByRole('row', { name: value }).getByRole('button', { name: 'Delete' }).click();
    await expect(iframe.getByRole('cell', { name: value })).not.toBeVisible();
  });

  test('Grabar documento', async () => {
    const numeroFactura = `test-` + `${Date.now()}`.slice(-5);
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframe.locator('[role="option"][data-index="1"]');
    await optionLocator.click();
    await iframe.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('100');
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframe.locator('#btnConfirmAddLine').click();
    await iframe.getByRole('textbox', { name: 'Factura #' }).fill(numeroFactura);
    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();
    await page.locator('.toast', { hasText: 'Cambios han sido guardados' }).isVisible();
  });

  test('Buscar documento', async () => {
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await expect(iframe.getByRole('button', { name: 'Buscar documento' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Buscar' }).click();
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
  });

  test('Anular documento', async () => {
    const numeroFactura = `anul-` + `${Date.now()}`.slice(-5);
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframe.locator('[role="option"][data-index="3"]');
    const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
    await optionLocator.click();
    await iframe.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('20');
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframe.locator('#btnConfirmAddLine').click();
    await iframe.getByRole('textbox', { name: 'Factura #' }).fill(numeroFactura);
    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();

    await expect(iframe.getByRole('button', { name: 'Anular documento' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Anular documento' }).click();
    await iframe.getByRole('button', { name: 'Buscar' }).click();
    await iframe.getByRole('row', { name: numeroFactura }).click();

    let errorAlert = null;
    page.on('dialog', async (dialog) => {
      const message = dialog.message();
      if (message.includes('No es posible anular documento')) {
        errorAlert = message;
      }
      await dialog.accept();
    });

    await iframe.locator('#btnConfirmNull').click();
    expect(errorAlert).toBeNull();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Buscar' }).click();
    await page.waitForTimeout(500);
    await expect(
      iframe.getByRole('row', { name: numeroFactura }).getByRole('cell', { name: '0.00' })
    ).toBeVisible();
  });

  test.fixme('Compras locales: Usar archivo Json', async () => {
    //TODO:
  });

  test.fixme('Compras locales: Obtener orden de compra', async () => {
    //TODO:
  });

});