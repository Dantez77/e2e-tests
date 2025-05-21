const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Entradas', () => {
  let page;
  let context;
  let iframe;
  const randomID = `${Date.now()}`.slice(-7);

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login
    await test.step('Login', async () => {
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    const inventarioBtn = page.getByRole('link', { name: 'btn-moduloInventario' });
    await expect(inventarioBtn).toBeVisible();
    await inventarioBtn.click();
    await page.getByRole('link', { name: 'Entradas', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Grabar entrada de inventario', async () => {
    const concepto = 'Entrada de prueba';
    await iframe.getByRole('textbox', { name: 'Tipo doc' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click(); // INDEX=2: Ajuste de entrada
    await iframe.getByRole('textbox', { name: 'Concepto' }).fill(concepto);

    await iframe.locator('#btnAddLine').click();

    await iframe.getByRole('textbox', { name: 'Almacen' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click(); // INDEX=0: Almacen 1
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('10');
    await iframe.getByRole('spinbutton', { name: 'Costo uni' }).fill('100');
    await iframe.locator('#btnConfirmAddLine').click();
    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Modificar entrada de inventario', async () => {
    const concepto = 'Entrada modificada: ' + randomID;

    const today = new Date();

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    const TDate = `${yyyy}-${mm}-${dd}`;


    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por fecha' }).click();

    await iframe.getByRole('textbox', { name: 'Desde' }).fill(TDate);
    await iframe.getByRole('textbox', { name: 'Hasta' }).fill(TDate);

    await iframe.getByRole('textbox', { name: 'Tipo de movimiento' }).click();
    await iframe.getByRole('option', { name: /Ajuste de entrada/ }).click();
    await iframe.getByRole('button', { name: 'Buscar' }).click();

    await iframe.getByRole('row', { name: 'Entrada de prueba' }).first().click();
    await iframe.getByRole('textbox', { name: 'Concepto' }).fill(concepto);
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular entrada de inventario', async () => {
    const concepto = 'Entrada modificada: ' + randomID;
    const conceptoAnulado = 'Entrada anulada: ' + randomID;

    const today = new Date();

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    const TDate = `${yyyy}-${mm}-${dd}`;

    await iframe.getByRole('button', { name: 'Anular documento' }).click();
    await iframe.getByRole('button', { name: 'Por fecha' }).click();

    await iframe.getByRole('textbox', { name: 'Desde' }).fill(TDate);
    await iframe.getByRole('textbox', { name: 'Hasta' }).fill(TDate);

    await iframe.getByRole('textbox', { name: 'Tipo de movimiento' }).click();
    await iframe.getByRole('option', { name: /Ajuste de entrada/ }).click();
    await iframe.getByRole('button', { name: 'Buscar' }).click();

    await iframe.getByRole('row', { name: concepto }).click();
    await iframe.getByRole('textbox', { name: 'Concepto' }).fill(conceptoAnulado);

    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });
});