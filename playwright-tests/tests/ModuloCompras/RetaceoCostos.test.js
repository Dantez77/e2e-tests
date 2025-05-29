const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('Modulo Compras - Retaceo de costos', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Retaceo de costos: flujo básico', async () => {
    await page.getByRole('link', { name: 'Retaceo de costos' }).click();

    // Los campos relevantes están vacíos
    await expect(iframe.locator('#grid_gastos').getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await expect(iframe.contentFrame().locator('#jsgrid_div').getByRole('cell', { name: 'Documento vacío' })).toBeVisible();

    // Seleccionar póliza
    await iframe.getByRole('textbox', { name: 'Poliza:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    // Revisar que se llenó todo
    await expect(iframe.locator('#grid_gastos').getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
    await expect(iframe.contentFrame().locator('#jsgrid_div').getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();

    // Agregar datos para el retaceo (asegúrate de que los datos existan, escoge entre los predefinidos)
    await iframe.getByRole('cell', { name: 'Seguros' }).click();
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await iframe.getByRole('button', { name: 'Actualizar' }).click();

    await iframe.getByRole('cell', { name: 'Otros gastos' }).click();
    await iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await iframe.getByRole('button', { name: 'Actualizar' }).click();
  });
});