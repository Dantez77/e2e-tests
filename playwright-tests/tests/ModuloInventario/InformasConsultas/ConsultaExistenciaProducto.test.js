import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { InventarioPage } from '@POM/inventarioPage';

test.describe('Consulta de existencias por producto', () => {
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
    await inventarioPage.goToInformesYconsultas(InventarioPage.INFORMES.CONSULTA_EXISTENCIAS_PRODUCTO);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Cargan las existencias del producto', async () => {
    await iframe.getByRole('textbox', { name: 'Producto' }).click();
    await iframe.getByRole('option', { name: /001/ }).click(); //ID:001
    await expect(iframe.getByText('Documento vacío')).not.toBeVisible();
    //Verifica que la tabla se lleno una vez se selecciono el documento
  });
});