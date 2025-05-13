const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Modulo Compras - Productos', () => {
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

  test('Agregar producto', async () => {
    const uniqueId = `${Date.now()}`;
    await page.getByRole('link', { name: 'Productos' }).click();

    //Detalles
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Descripcion', exact: true }).fill('descripcion producto');
    await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByText('Contables').click();
    await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframe.getByText('Costo artículos producidos/').click();
    await iframe.getByText('Precios').click();
    await iframe.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('100');

    //Grabar
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Verificar que fue creado
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId, exact: true })).toBeVisible();
  });

  test('Eliminar producto', async () => {
    const uniqueId = `${Date.now()}`;
    await page.getByRole('link', { name: 'Productos' }).click();

    // Crear producto para eliminar
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Descripcion', exact: true }).fill('descripcion producto');
    await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByText('Contables').click();
    await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframe.getByText('Costo artículos producidos/').click();
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // Buscar producto
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    const cellLocator = iframe.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible();

    // Eliminar producto
    const rowLocator = iframe.locator('tr').filter({ has: cellLocator });
    await rowLocator.locator('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    // Verificar que fue eliminado
    await expect(cellLocator).toHaveCount(0, { timeout: 5000 });
  });
});