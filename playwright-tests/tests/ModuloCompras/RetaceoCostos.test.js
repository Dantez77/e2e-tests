import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('Retaceo de costos', () => {
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
    await comprasPage.goToSubModule(ComprasPage.MAIN.RETACEO_DE_COSTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.fixme('Retaceo de costos: flujo básico', async () => {
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