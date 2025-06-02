import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe.serial('Pólizas de importación', () => {
  let page;
  let context;
  let iframe;
  const numeroPl = `PL-` + `${Date.now()}`.slice(-7);

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
    await comprasPage.goToSubModule(ComprasPage.MAIN.POLIZAS_DE_IMPORTACION);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar registro de póliza de importación', async () => {
    test.slow();
    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Agregar' }).click();

    // Llenando el formulario
    await iframe.getByRole('textbox', { name: 'Póliza No.:' }).fill(numeroPl);
    await iframe.getByRole('textbox', { name: 'Fecha de ingreso' }).fill('2025-04-21');
    await iframe.getByRole('textbox', { name: 'Agencia que tramita' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Inicio de trámites' }).fill('2025-04-01');
    await iframe.getByRole('textbox', { name: 'Final de trámites' }).fill('2025-04-30');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // Confirmar que el registro fue creado
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframe.getByRole('cell', { name: numeroPl })).toBeVisible();
  });

  test('Eliminar registro de póliza de importación', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframe.getByRole('cell', { name: numeroPl })).toBeVisible();

    let errorAlert = null;
    page.on('dialog', async (dialog) => {
      const message = dialog.message();
      if (message.includes('No es posible eliminar. Hay datos relativos')) {
        errorAlert = message;
      }
      await dialog.dismiss();
    });

    await iframe.getByRole('row', { name: numeroPl }).getByRole('button').nth(1).click();
    expect(errorAlert).toBeNull(); // Si se muestra el mensaje de error, la prueba falla
  });
});