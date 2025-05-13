const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { crearNota } = require('../helpers/crearNota');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Nota de Débito', () => {
  let page;
  let context;
  let iframeElement;
  let numeroCFF = '';
  let documentValue;
  const tipoPago = 'Credito';
  const tipoNota = 'Nota de débito';
  const newVendor = 'Bob';

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

    // Crear un Credito Fiscal y una Nota de Débito asociada
    numeroCFF = await crearCreditoFiscal(page, iframeElement, tipoPago);
    documentValue = await crearNota(page, iframeElement, numeroCFF, tipoNota);
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Nota de débito', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Validando Creación de Nota de Débito', async () => {
    await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await expect(iframeElement.getByRole('row', { name: documentValue })).toBeVisible();
  });

  test('Editando Nota de Débito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await iframeElement.getByRole('cell', { name: documentValue }).click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();

    await expect(iframeElement.getByRole('button', { name: 'Grabar cambios' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

    // Luego de grabar cambios regreso a la pagina principal de notas de débito y vuelvo a buscar
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);

    await expect(
      iframeElement.getByRole('row', { name: documentValue }).getByRole('cell', { name: newVendor })
    ).toBeVisible();
  });

  test('Anulando Nota de Débito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await iframeElement.getByRole('cell', { name: documentValue }).click();

    await expect(iframeElement.locator('#btnConfirmNull')).toBeVisible();
    await iframeElement.locator('#btnConfirmNull').click();
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);

    const row = iframeElement.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});