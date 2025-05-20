const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Consulta de Partidas', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login and navigate to Modulo Ventas
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const contabilidadBtn = page.getByRole('link', { name: 'btn-moduloContabilidad' });
      await expect(contabilidadBtn).toBeVisible();
      await contabilidadBtn.click();
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloContabilidad' }).click();
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

    //Agregar: DEBE
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Cod. Cuenta' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();

    //Agregar: Haber
    await iframe.locator('#btnAddLine').click();
    await iframe.getByRole('textbox', { name: 'Debe/Haber' }).click();
    await iframe.locator('#mobiscroll1747667705333').getByRole('option', { name: 'Haber' }).click();
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();

    //Grabar cambios
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test.fixme('Test 2', async () => {
    //TODO:
  });
});