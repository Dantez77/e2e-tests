import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe.serial('Datos de la empresa', () => {
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
    const comprasPage = new ComprasPage(page);
    await comprasPage.goToConfiguraciones(ComprasPage.CONFIGURACIONES.DATOS_DE_LA_EMPRESA);
    iframe = page.frameLocator('iframe');
  });


  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Observar que abre la pagina y se muestran todos los elementos', async () => {
    await expect(iframe.getByRole('listitem')).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Grabar' })).toBeVisible();
    await expect(iframe.getByRole('textbox', { name: 'Nombre de la empresa' })).toBeVisible();
  });
});