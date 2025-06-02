const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('Compras Locales', () => {
  let page;
  let context;
  let iframe;
  const numeroFactura = `test-` + `${Date.now()}`.slice(-5);


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
    await comprasPage.goToSubModule(ComprasPage.MAIN.COMPRAS_LOCALES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
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
    await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Factura #' }).fill(numeroFactura);

    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    await iframe.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('100');
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframe.locator('#btnConfirmAddLine').click();

    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Buscar documento', async () => {
    await expect(iframe.getByRole('button', { name: 'Buscar documento' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Buscar' }).click();
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
  });

  test('Anular documento', async () => {
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
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
    ;
  });

  test.fixme('Compras locales: Usar archivo Json', async () => {
    //TODO:
  });

  test.fixme('Compras locales: Obtener orden de compra', async () => {
    //TODO:
  });

});