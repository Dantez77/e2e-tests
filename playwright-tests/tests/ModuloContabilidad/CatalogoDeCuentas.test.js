const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Catálogo de cuentas', () => {
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
    await page.getByRole('link', { name: 'Catálogo de cuentas', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  // Test taking failure into account since this fails due to weird text fields
  test('Agregar cuenta contable', async () => {
    const codCuenta = 'CC-' + `${Date.now()}`.slice(-7);
    const nomCuenta = 'Cuenta Prueba'
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).fill(codCuenta);
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nomCuenta);

    await iframe.getByRole('textbox', { name: 'Los cargos suman o restan:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click(); //INDEX=1 SUMA || INDEX=2 RESTA

    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Modificar cuenta contable', async () => {
    //TODO: Modificar cuenta contable y verificacion de modificacion al final
  });

  test('Eliminar cuenta contable', async () => {
    //TODO: Eliminar cuenta contable y verificacion de eliminacion al final
  });
});