const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../helpers/crearCreditoFiscal');
const { crearNota } = require('../helpers/crearNota');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Nota de Crédito', () => {
  // TODO: Añadir las funcionalidades posibles dentro de Nota de Credito, esto incluye:
  // - Crear un documento (indice de exito: Verificacion de documento creado) - COMPLETO
  // - Editar un documento (indice de exito: Verificacion de documento editado) - COMLPETO 
  // - Anular un documento (indice de exito: Verificacion de que el documento fue anulado) - COMPLETO 
  // REQUIERE PARA FUNCIONAR: Creacion previa de credito fiscal. crearCreditoFiscal(page, iframe);
  let page;
  let context;
  let iframeElement;
  let numeroCFF = '';
  let documentValue;
  const tipoPago = 'Contado';
  const tipoNota = 'Nota de crédito';

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

    // Crear un Credito Fiscal y una Nota de Crédito asociada
    numeroCFF = await crearCreditoFiscal(page, iframeElement, tipoPago);
    documentValue = await crearNota(page, iframeElement, numeroCFF, tipoNota);
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Nota de crédito', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Validando Creación de Nota de Crédito', async () => {
    await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editando Nota de Crédito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);
    await iframeElement.getByRole('cell', { name: documentValue }).click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();

    await expect(iframeElement.getByRole('button', { name: 'Grabar cambios' })).toBeEnabled();
    await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

    // Luego de grabar cambios regreso a la pagina principal de notas de crédito y vuelvo a buscar
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframeElement, documentValue);

    const nuevoVendedor = 'Bob'; // Ajusta si el nombre cambia
    await expect(
      iframeElement.getByRole('row', { name: documentValue }).getByRole('cell', { name: nuevoVendedor })
    ).toBeVisible();
  });

  test('Anulando Nota de Crédito', async () => {
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