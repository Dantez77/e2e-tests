const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Credito Fiscal', () => {
  let numeroCFF;
  const tipoPago = 'Contado';
  const vendedor = 'Bob';

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Login
      await login(page, credentials);
      await page.getByRole('link', { name: 'btn-moduloVentas' }).click();

      const iframe = page.frameLocator('iframe');
      numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago, vendedor); // Pass vendedor parameter
      console.log(`Credito Fiscal creado: ${numeroCFF}`);
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    } finally {
      await page.close();
      await context.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
  });

  test('Validar nuevo documento', async ({ page }) => {
    test.skip(!numeroCFF, 'No document was created in beforeAll');

    const iframe = page.frameLocator('iframe');
    await busquedaDoc(page, iframe, numeroCFF);

    await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible();
  });

  test('Editar el documento creado', async ({ page }) => {
    test.skip(!numeroCFF, 'No document was created in beforeAll');

    const iframe = page.frameLocator('iframe');
    await busquedaDoc(page, iframe, numeroCFF);
    await iframe.getByRole('cell', { name: numeroCFF }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    const saveButton = iframe.getByRole('button', { name: 'Grabar cambios' });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    await saveButton.click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular el documento', async ({ page }) => {
    test.skip(!numeroCFF, 'No document was created in beforeAll');

    const iframe = page.frameLocator('iframe');
    console.log(`Credito a Anular: ${numeroCFF}`);

    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('button', { name: 'Anular documento' }).click();


    await busquedaDoc(page, iframe, numeroCFF);

    await iframe.getByRole('cell', { name: numeroCFF }).click();

    const confirmButton = iframe.locator('#btnConfirmNull');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    const proceedButton = iframe.getByRole('button', { name: 'Si - proceder' });
    await expect(proceedButton).toBeVisible();
    await proceedButton.click();

    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, numeroCFF);

    await expect(
      iframe.getByRole('row', { name: numeroCFF })
    ).toHaveCount(0);
  });
});