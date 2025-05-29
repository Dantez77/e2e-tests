const { test, expect } = require('@playwright/test');
const { crearCotizacion } = require('@helpers/crearCotizacion');
const { busquedaDoc } = require('@helpers/busquedaDoc');
const credentials = require('@config/credentials.js');
const { login } = require('helpers/login.js');

test.describe.serial('Cotización', () => {
  let page;
  let context;
  let iframe;
  let documentValue = '';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login and navigate to Modulo Ventas
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Cotización', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear Cotización', async () => {
    documentValue = await crearCotizacion(page, iframe);
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editar Cotización', async () => {
    if (!documentValue) documentValue = await crearCotizacion(page, iframe);

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    // Editar Vendedor
    await iframe.getByRole('textbox', { name: 'Vendedor' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframe.getByRole('button', { name: 'Cancel' }).click();

    // Verificar cambios
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(
      iframe.getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' }) // Ajusta el nombre si es necesario
    ).toBeVisible();
  });

  test('Anular Cotización', async () => {
    if (!documentValue) documentValue = await crearCotizacion(page, iframe);

    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    const row = iframe.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});