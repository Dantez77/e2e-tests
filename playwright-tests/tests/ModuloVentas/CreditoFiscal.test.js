const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Credito Fiscal', () => {
  let numeroCFF = undefined;
  const tipoPago = 'Contado';
  const vendedor = 'Bob';
  console.log(`Credito antes de asignar: ${numeroCFF}`);

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const iframe = page.frameLocator('iframe');

    // Login 
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();

    numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago); //Credito Fiscal

    await page.close();
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
  });

  test('Validar nuevo documento', async ({ page }) => {
    const iframe = page.frameLocator('iframe');
    await busquedaDoc(page, iframe, numeroCFF);
    await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible();
  });

  test('Editar el documento creado', async ({ page }) => {
    const iframe = page.frameLocator('iframe');
    await busquedaDoc(page, iframe, numeroCFF);
    await iframe.getByRole('cell', { name: numeroCFF }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    await expect(iframe.getByRole('button', { name: 'Grabar cambios' })).toBeVisible({ timeout: 5000 });
    await expect(iframe.getByRole('button', { name: 'Grabar cambios' })).toBeEnabled({ timeout: 5000 });

    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular el documento', async ({ page }) => {
    const iframe = page.frameLocator('iframe');
    console.log(`Credito a Anular: ${numeroCFF}`);
    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await expect(iframe.getByRole('button', { name: 'Anular Documento' })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();

    await busquedaDoc(page, iframe, numeroCFF);
    await iframe.getByRole('cell', { name: numeroCFF }).click();

    await expect(iframe.locator('#btnConfirmNull')).toBeVisible({ timeout: 5000 });
    await iframe.locator('#btnConfirmNull').click();

    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible({ timeout: 5000 });
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await iframe.getByRole('button', { name: 'Buscar documento' }).click();

    // Verificar que el item ya no se encuentra en la tabla
    await busquedaDoc(page, iframe, numeroCFF);
    await expect(
      iframe.getByRole('row', { name: numeroCFF }).getByRole('cell', { name: vendedor })
    ).toHaveCount(0);
  });
});
