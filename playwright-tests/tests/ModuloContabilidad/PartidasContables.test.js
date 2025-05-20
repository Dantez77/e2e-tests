const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Consulta de Partidas', () => {
  let page;
  let context;
  let iframe;

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
    const contabilidadBtn = page.getByRole('link', { name: 'btn-moduloContabilidad' });
    await expect(contabilidadBtn).toBeVisible();
    await contabilidadBtn.click();
    await page.getByRole('link', { name: 'Partidas contables', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear documento', async () => {
    await iframe.getByRole('textbox', { name: 'Prefijo:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Concepto de la partida' }).fill('Prueba de Partida');

    //Agregar: DEBE
    await iframe.locator('#btnAddLine').click();
    await iframe.getByRole('textbox', { name: 'Cod. Cuenta' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();

    //Agregar: Haber
    await iframe.locator('#btnAddLine').click();
    await iframe.getByRole('textbox', { name: 'Debe/Haber' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click(); //HABER esta en index 1
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();

    //Grabar cambios
    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Editar documento de Consulta de Partidas', async () => {
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por concepto' }).click();
    await iframe.getByRole('textbox', { name: 'Concepto o parte del texto' }).fill('Prueba de Partida');
    await iframe.getByRole('button', { name: 'Buscar' }, { exact: true }).click();

    await iframe.getByRole('cell', { name: 'Prueba de Partida' }).first().click();
    await iframe.getByRole('textbox', { name: 'Concepto de la partida' }).fill('Prueba Editada');

    await iframe.getByRole('button', { name: 'Grabar Cambios' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular documento de Consulta de Partidas', async () => {
    await iframe.getByRole('button', { name: 'Anular documento' }).click();

    await iframe.getByRole('button', { name: 'Por concepto' }).click();
    await iframe.getByRole('textbox', { name: 'Concepto o parte del texto' }).fill('Prueba Editada');
    await iframe.getByRole('button', { name: 'Buscar' }, { exact: true }).click();

    await iframe.getByRole('cell', { name: 'Prueba Editada' }).first().click();
    await iframe.getByRole('textbox', { name: 'Concepto de la partida' }).fill('Prueba Anulada');

    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');

  });
});