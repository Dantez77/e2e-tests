const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('@helpers/busquedaDoc');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe.serial('Catálogo de cuentas', () => {
  let page;
  let context;
  let iframe;
  const codCuenta = 'CC-' + `${Date.now()}`.slice(-7);
  const nomCuenta = 'Cuenta Prueba'
  const nomCuentaEdita = 'Cuenta Modificada'


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

  test('Agregar cuenta contable', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).fill(codCuenta);
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nomCuenta);

    await iframe.getByRole('textbox', { name: 'Los cargos suman o restan:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click(); //INDEX=1 SUMA || INDEX=2 RESTA

    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Modificar cuenta contable', async () => {

    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('CC-');
    await iframe.getByRole('row', { name: /CC-/ }).first().getByRole('button').nth(0).click();
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nomCuentaEdita);
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await expect(iframe.getByRole('cell', { name: nomCuentaEdita })).toBeVisible();
  });

  test('Eliminar cuenta contable', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('CC-');
    await iframe.getByRole('row', { name: /CC-/ }).first().getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.getByRole('cell', { name: 'CC-' })).toHaveCount(0);
  });

  //Solo usar para limpiar las tablas
  test.skip('Limpiar todas las cuentas restantes', async () => {
    test.fail();
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('CC-');
    // Loop while there are rows matching /^CC-/
    while (await iframe.getByRole('row', { name: /CC-/ }).count() > 0) {
      await iframe.getByRole('row', { name: /CC-/ }).first().getByRole('button').nth(1).click();
      await iframe.getByRole('button', { name: 'Eliminar' }).click();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();
      // Wait for the row to disappear before next iteration
      await expect(iframe.getByRole('row', { name: /CC-/ }).first()).toBeHidden({ timeout: 5000 }).catch(() => { });
    }
    // Assert no CC- rows remain
    await expect(iframe.getByRole('cell', { name: /CC-/ })).toHaveCount(0);
  });
});