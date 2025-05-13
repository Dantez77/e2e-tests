const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Credito Fiscal', () => {
  let page;
  let context;
  let iframeElement;
  let numeroCFF;
  const tipoPago = 'Contado';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

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
      numeroCFF = await crearCreditoFiscal(page, iframeElement, tipoPago);

      //VERIFICAR QUE SE CREO EL DOCUMENTO
      await page.getByRole('link', { name: 'Crédito fiscal' }).click();
      await busquedaDoc(page, iframeElement, numeroCFF);
      await expect(iframeElement.getByRole('cell', { name: numeroCFF })).toBeVisible();
    });

    await test.step('Editar el documento creado', async () => {
      await iframeElement.getByRole('cell', { name: numeroCFF }).click();
      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();
      await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

      await expect(iframeElement.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
    });

    await test.step('Anular el documento', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();
      await iframeElement.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: 'Bob' }).click();
      await page.waitForTimeout(500);
      await iframeElement.locator('#btnConfirmNull').click();

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

      await expect(iframeElement.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
    });
  });
});