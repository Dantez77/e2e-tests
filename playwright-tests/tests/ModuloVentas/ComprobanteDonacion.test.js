const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');
const { busquedaDoc } = require('../helpers/busquedaDoc');

//REQUIERE DOCUMENTO DE DONACION DN DE DE NUMERACION DE DOCUMENTOS POR SUCURSAL

test.describe('Comprobante de Donación', () => {
  let page;
  let context;
  let iframe;
  let documentValue;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Comprobante de donación', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Creacion de documento', async () => {
    await iframe.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();

    await iframe.getByRole('textbox', { name: 'Forma de pago' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await iframe.getByRole('textbox', { name: 'Código' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();

    await iframe.locator('#btnConfirmAddLine').click();
    documentValue = await iframe.locator('input#coddoc').inputValue();
    await iframe.getByRole('button', { name: 'Grabar documento' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Busqueda de documento', async () => {
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editar documento', async () => {
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.getByRole('textbox', { name: 'Fecha' }).fill('2010-01-01');

    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('row', { name: documentValue })
      .getByRole('cell', { name: '2010-01-01' }))
      .toBeVisible();
  });

  test('Anular documento', async () => {
    await iframe.getByRole('button', { name: 'Anular documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
    await iframe.getByRole('cell', { name: documentValue }).click();

    //Anular doc
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');

    //Confirmar que fue anulado
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('row', { name: documentValue })
      .getByRole('cell', { name: '0.00' }))
      .toBeVisible();
  });
});