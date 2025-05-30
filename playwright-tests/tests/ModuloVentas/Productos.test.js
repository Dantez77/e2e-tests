import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { login } from '@helpers/login.js';
import { crearProducto } from '@helpers/crearProducto.js';

test.describe('Productos', () => {
  let page;
  let context;
  let iframeElement;
  let uniqueId;
  let producto;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

    // Login and navigate to Modulo Ventas
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
      await page.getByRole('link', { name: 'Productos', exact: true }).click();
      iframeElement = page.frameLocator('iframe');
    });

    // Crear producto
    uniqueId = `P-` + `${Date.now()}`.slice(-7);
    producto = `Producto ` + `${Date.now()}`.slice(-4);

    await crearProducto(iframeElement, uniqueId, producto);

    // Esperar a que el producto esté visible
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Productos', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Verificar que el producto fue creado', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
  });

  test('Editar producto', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
    await iframeElement.getByText('Precios').click();
    await iframeElement.getByRole('spinbutton', { name: 'Precio 1 CON IVA' }).fill('50');
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    await expect(
      iframeElement.getByRole('row', { name: uniqueId }).getByRole('cell', { name: '50.00' })
    ).toBeVisible();
  });

  test('Eliminar producto', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
    await page.waitForTimeout(500);
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    await expect(
      iframeElement.getByRole('row', { name: uniqueId })
    ).toHaveCount(0);
  });
});