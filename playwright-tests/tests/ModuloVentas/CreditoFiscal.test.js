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
  const vendedor = 'Bob'; // Nombre de vendedor que se edita

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

    if (numeroCFF) {
      numeroCFF = undefined;
    }

    numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago, vendedor);

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
    if (numeroCFF) {
      numeroCFF = undefined;
    }
  });

  test('Credito fiscal: Validar nuevo documento', async () => {
    //VERIFICAR QUE SE CREO EL DOCUMENTO
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
    await busquedaDoc(page, iframe, numeroCFF);
    await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible();
  });

  test('Credito fiscal: Editar el documento creado', async () => {
    await busquedaDoc(page, iframe, numeroCFF);
    await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('cell', { name: numeroCFF }).click();
    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();
    await expect(iframe.getByRole('button', { name: 'Grabar cambios' })).toBeVisible({ timeout: 5000 });
    await expect(iframe.getByRole('button', { name: 'Grabar cambios' })).toBeEnabled({ timeout: 5000 });
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular el documento', async () => {
    test.slow();
    console.log(`Credito a Anular: ${numeroCFF}`);

    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await expect(iframe.getByRole('button', { name: 'Anular Documento' })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    //TODO: Continue with search logic
    await expect(iframe.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: vendedor })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: vendedor }).click();
    await expect(iframe.locator('#btnConfirmNull')).toBeVisible({ timeout: 5000 });
    await iframe.locator('#btnConfirmNull').click();

    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();

    await busquedaDoc(page, iframe, numeroCFF);
    await expect(iframe.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: vendedor })).toHaveCount(0);

  });
});