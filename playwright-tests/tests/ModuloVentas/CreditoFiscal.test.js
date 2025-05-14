const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Credito Fiscal', () => {
  let page;
  let context;
  let iframe;
  let numeroCFF;
  const tipoPago = 'Contado';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    //LOGIN -> MODULO VENTAS
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  //CREDITO FISCAL
  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Credito fiscal: Agregar, Editar y Anular', async () => {
    await test.step('Agregar un nuevo documento', async () => {
      numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago);

      //VERIFICAR QUE SE CREO EL DOCUMENTO
      await page.getByRole('link', { name: 'Crédito fiscal' }).click();
      await busquedaDoc(page, iframe, numeroCFF);
      await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible();
    });

    await test.step('Editar el documento creado', async () => {
      await iframe.getByRole('cell', { name: numeroCFF }).click();
      await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframe.locator('[role="option"][data-index="1"]').click();
      await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

      await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
    });

    await test.step('Anular el documento', async () => {
      await iframe.getByRole('button', { name: 'Anular Documento' }).click();
      
      await iframe.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: 'Bob' }).click();
      await expect(iframe.locator('#btnConfirmNull')).toBeVisible({ timeout: 5000 });
      await iframe.locator('#btnConfirmNull').click();

      await iframe.getByRole('button', { name: 'Si - proceder' }).click();

      await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados', { timeout: 5000 });
    });
  });
});