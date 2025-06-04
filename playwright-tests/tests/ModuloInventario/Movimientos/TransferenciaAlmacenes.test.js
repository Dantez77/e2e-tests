import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

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
      const loginPage = new LoginPage(page);
      await loginPage.login(credentials);
    });
  });

  test.beforeEach(async () => {
    const inventarioPage = new InventarioPage(page);
    await inventarioPage.goToMovimientos(InventarioPage.MOVIMIENTOS.TRANSFERENCIA_ALMACENES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Realizar transferencia', async () => {
    const concepto = 'Transferencia de prueba';
    await iframe.getByRole('textbox', { name: 'Concepto' }).fill(concepto);
    await iframe.getByRole('textbox', { name: 'Sale de alm:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click(); // INDEX=0:
    await iframe.getByRole('textbox', { name: 'Entra en alm:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click(); // INDEX=0:
    await iframe.getByRole('textbox', { name: 'Concepto' }).fill('Movimiento Prueba');

    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Item' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click(); // INDEX=1:
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('1000');
    await iframe.locator('#btnConfirmAddLine').click();

    //await iframe.locator('#btnConfirmAddLine').click();
    await iframe.getByRole('button', { name: 'Grabar Documento' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Buscar y Editar movimiento de inventario', async () => {
    const today = new Date();

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    const TDate = `${yyyy}-${mm}-${dd}`;

    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por numero / sucursal' }).click();

    await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click(); // INDEX=0:

    await iframe.getByRole('button', { name: 'Buscar' }).click();

    await iframe.getByRole('cell', { name: 'Movimiento Prueba' }).first().click();

    await iframe.getByRole('textbox', { name: 'Concepto' }).fill('Movimiento Editado');

    //await iframe.locator('#btnConfirmAddLine').click();
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular entrada de inventario', async () => {
    test.slow();
    const randomID = Date.now().toString().slice(-7);
    const today = new Date();

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();

    const TDate = `${yyyy}-${mm}-${dd}`;

    await iframe.getByRole('button', { name: 'Anular documento' }).click();
    await iframe.getByRole('button', { name: 'Por numero / sucursal' }).click();

    await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click(); // INDEX=0:

    await iframe.getByRole('button', { name: 'Buscar' }).click();

    await iframe.getByRole('cell', { name: 'Movimiento Editado' }).first().click();

    await iframe.getByRole('textbox', { name: 'Concepto' }).fill('Anulado-' + randomID);

    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
  });
});