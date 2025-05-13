const { test, expect } = require('@playwright/test');
const { crearCotizacion } = require('../helpers/crearCotizacion');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Cotización', () => {
  let page;
  let context;
  let iframeElement;
  let documentValue = '';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

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
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear Cotización', async () => {
    documentValue = await crearCotizacion(page, iframeElement);
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editar Cotización', async () => {
    // Asegúrate de tener una cotización creada
    if (!documentValue) documentValue = await crearCotizacion(page, iframeElement);

    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await iframeElement.getByRole('cell', { name: documentValue }).click();

    // Editar Vendedor
    await iframeElement.getByRole('textbox', { name: 'Vendedor' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframeElement.getByRole('button', { name: 'Cancel' }).click();

    // Verificar cambios
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await expect(
      iframeElement.getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' }) // Ajusta el nombre si es necesario
    ).toBeVisible();
  });

  test('Anular Cotización', async () => {
    // Asegúrate de tener una cotización creada
    if (!documentValue) documentValue = await crearCotizacion(page, iframeElement);

    await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await iframeElement.getByRole('cell', { name: documentValue }).click();

    await iframeElement.locator('#btnConfirmNull').click();
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);

    const row = iframeElement.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});