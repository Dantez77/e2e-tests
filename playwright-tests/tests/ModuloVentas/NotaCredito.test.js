const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('@helpers/crearCreditoFiscal');
const { crearNota } = require('@helpers/crearNota');
const { busquedaDoc } = require('@helpers/busquedaDoc');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

// REQUIERE PARA FUNCIONAR: Creacion previa de credito fiscal. crearCreditoFiscal(page, iframe);
test.describe('Nota de Crédito', () => {
  let page;
  let context;
  let iframe;
  let numeroCFF = '';
  let documentValue;
  const tipoPago = 'Contado';
  const tipoNota = 'Nota de crédito';

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

    // Crear un Credito Fiscal y una Nota de Crédito asociada
    numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago);
    documentValue = await crearNota(page, iframe, numeroCFF, tipoNota);
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Nota de crédito', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Validando Creación de Nota de Crédito', async () => {
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editando Nota de Crédito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    //await expect(iframeElement.getByRole('button', { name: 'Grabar cambios' })).toBeEnabled();
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    // Luego de grabar cambios regreso a la pagina principal de notas de crédito y vuelvo a buscar
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    const nuevoVendedor = 'Bob'; // Ajusta si el nombre cambia
    await expect(
      iframe.getByRole('row', { name: documentValue }).getByRole('cell', { name: nuevoVendedor })
    ).toBeVisible();
  });

  test('Anulando Nota de Crédito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await expect(iframe.locator('#btnConfirmNull')).toBeVisible();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    const row = iframe.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});