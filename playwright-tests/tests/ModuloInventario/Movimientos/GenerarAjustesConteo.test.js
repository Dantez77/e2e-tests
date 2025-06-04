import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe.serial('Generar ajustes de conteo físico', () => {
  let page;
  let context;
  let iframe;

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
    await inventarioPage.goToMovimientos(InventarioPage.MOVIMIENTOS.GENERAR_AJUSTES_CONTEO);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Elementos a ejecutar cargan correctamente', async () => {
    await expect(iframe.getByText('Generar ajustes de conteo fisico de inventarios')).toBeVisible();
    // Verificar que diferentes tipos de busqueda funcionen y que es posible agregar conteos
  });
});