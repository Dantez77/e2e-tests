import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('Productos', () => {
  let page;
  let context;
  let iframe;
  const uniqueId = `P-` + `${Date.now()}`.slice(-7);
  const producto = `Producto ` + `${Date.now()}`.slice(-4);


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
    const comprasPage = new ComprasPage(page);
    await comprasPage.goToSubModule(ComprasPage.MAIN.PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar producto', async () => {
    await test.step('Agregando el item a la tabla', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframe.getByRole('textbox', { name: 'Descripcion', exact: true }).fill(producto);
      await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByText('NoSí').first().click();
      await iframe.getByText('NoSí').nth(2).click();
      await iframe.getByText('NoSí').nth(1).click();
      await iframe.getByText('Contables').click();
      await iframe.getByRole('textbox', { name: 'Concepto de gastos de importación' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByText('Precios').click();
      await iframe.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('20');
      await iframe.getByRole('spinbutton', { name: 'Precio 2 SIN IVA' }).fill('22');
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();
    });
  });

  test('Eliminar producto', async () => {
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