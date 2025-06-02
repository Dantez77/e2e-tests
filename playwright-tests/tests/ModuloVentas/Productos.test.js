import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { crearProducto } from '@helpers/crearProducto.js';
import { LoginPage } from '@POM/loginPage';
import { VentasPage } from '@POM/ventasPage';


test.describe('Productos', () => {
  let page;
  let context;
  let iframe;
  let uniqueId = `P-` + `${Date.now()}`.slice(-7);
  let producto = `Producto ` + `${Date.now()}`.slice(-4);

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
    const ventasPage = new VentasPage(page);
    await ventasPage.goToSubModule(VentasPage.MAIN.PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear producto', async () => {
    await crearProducto(iframe, uniqueId, producto);
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Buscar producto', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();
  });

  test('Editar producto', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
    await iframe.getByText('Precios').click();
    await iframe.getByRole('spinbutton', { name: 'Precio 1 CON IVA' }).fill('50');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(
      iframe.getByRole('row', { name: uniqueId }).getByRole('cell', { name: '50.00' })
    ).toBeVisible();
  });

  test('Eliminar producto', async () => {
    await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await page.waitForTimeout(500);
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    await expect(
      iframe.getByRole('row', { name: uniqueId })
    ).toHaveCount(0);
  });
});