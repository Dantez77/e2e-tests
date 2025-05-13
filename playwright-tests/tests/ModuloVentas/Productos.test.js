const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

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
    });
  });

  test.beforeEach(async () => {
    uniqueId = `P-` + `${Date.now()}`.slice(-7);
    producto = `Producto ` + `${Date.now()}`.slice(-4);
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Productos', exact: true }).click();
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar, Editar y Eliminar Producto', async () => {
    // Agregar producto
    await test.step('Agregar producto', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframeElement.getByRole('textbox', { name: 'Descripcion', exact: true }).fill(producto);

      await iframeElement.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByText('NoSí').first().click(); // Insumo
      await iframeElement.getByText('NoSí').nth(2).click();  // Solo maneja unidades completas
      await iframeElement.getByText('NoSí').nth(1).click();  // Este producto de puede vender

      await iframeElement.getByText('Contables').click();
      await iframeElement.getByRole('textbox', { name: 'Concepto de gastos de importación' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();
      await iframeElement.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByText('Precios').click();
      await iframeElement.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('20');
      await iframeElement.getByRole('spinbutton', { name: 'Precio 2 SIN IVA' }).fill('22');

      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
    });

    // Editar producto
    await test.step('Editar producto', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
      await iframeElement.getByText('Precios').click();
      await iframeElement.getByRole('spinbutton', { name: 'Precio 1 CON IVA' }).fill('50');
      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      // Confirmar que se realizó la edición
      await expect(
        iframeElement.getByRole('row', { name: uniqueId }).getByRole('cell', { name: '50' })
      ).toBeVisible();
    });

    // Eliminar producto
    await test.step('Eliminar producto', async () => {
      await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
      await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
      await page.waitForTimeout(500);
      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500);

      // Asegurarse que el producto ya no existe
      await expect(
        iframeElement.getByRole('row', { name: uniqueId })
      ).toHaveCount(0);
    });
  });
});