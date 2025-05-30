import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { login } from '@helpers/login.js';

test.describe.serial('Factura de Exportación', () => {
  let page;
  let context;
  let iframe;
  let documentValue;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');
    await test.step('Login', async () => {
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
    await expect(ventasBtn).toBeVisible();
    await ventasBtn.click();
    await page.getByRole('link', { name: 'Factura de exportación', exact: true }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear Factura de exportacion', async () => {
    await page.waitForTimeout(500);
    documentValue = await iframe.locator('input#coddoc').inputValue();

    await iframe.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    await iframe.getByRole('textbox', { name: 'Forma de pago' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    await iframe.getByRole('textbox', { name: 'Fecha Embarque' }).fill('2025-05-05');
    await iframe.getByRole('textbox', { name: 'Via de transporte' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();

    await iframe.getByRole('textbox', { name: 'Recinto Fiscal' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();

    await iframe.getByRole('textbox', { name: 'Regimen Fiscal' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await iframe.getByRole('textbox', { name: 'Código' }).click();
    await iframe.locator('[role="option"][data-index="4"]').click();
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('12');

    await iframe.locator('#btnConfirmAddLine').click();

    await iframe.getByRole('button', { name: 'Grabar documento' }).click();

    // Verificar que fue creado
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
    await iframe.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editar Factura de exportacion', async () => {
    // Buscar el documento creado previamente
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
    await iframe.getByRole('button', { name: 'Buscar', exact: true }).click();
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    // Verificar que el documento fue editado
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
    await iframe.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(
      iframe.getByRole('row', { name: documentValue }).getByRole('cell', { name: 'John Doe' })
    ).toBeVisible();
  });

  test('Anular Factura de exportacion', async () => {
    // Buscar el documento creado previamente
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();

    await iframe.getByRole('button', { name: 'Por número' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    // Confirmar que fue anulado
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await iframe.getByRole('button', { name: 'Por número' }).click();
    await iframe.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
    await iframe.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(
      iframe.getByRole('row', { name: documentValue }).getByRole('cell', { name: 'John Doe' })
    ).toHaveCount(0);
  });

  // Correr individualmente para limpiar la tabla
  test.skip('Limpiar tabla', async () => {
    const serie = '20ST000X';
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await iframe.getByRole('row', { name: serie }).first().click();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    //await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });
});