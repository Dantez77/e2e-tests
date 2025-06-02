import { test, expect } from '@playwright/test';
import { busquedaDoc } from '@helpers/busquedaDoc';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { VentasPage } from '@POM/ventasPage';

test.describe.serial('Credito Fiscal', () => {
  let page;
  let iframe;
  let context;
  let numeroCFF;
  const tipoPago = 'Contado';

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
    await ventasPage.goToSubModule(VentasPage.MAIN.CREDITO_FISCAL);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async ({ browser }) => {
    await page.close();
    await context.close();
  });

  test('Crear credito', async ({ page }) => {
    test.slow();
    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await iframe.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframe.getByRole('option', { name: tipoPago }).click();

    numeroCFF = await iframe.locator('input#coddoc').inputValue();

    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();

    await iframe.getByRole('button', { name: 'Grabar documento' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento ha sido grabado');
  });

  test('Buscar credito', async ({ page }) => {
    await busquedaDoc(page, iframe, numeroCFF);
    await expect(iframe.getByRole('cell', { name: numeroCFF })).toBeVisible();
  });

  test('Editar el credito', async ({ page }) => {
    await busquedaDoc(page, iframe, numeroCFF);
    await iframe.getByRole('cell', { name: numeroCFF }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    const saveButton = iframe.getByRole('button', { name: 'Grabar cambios' });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();

    await saveButton.click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');
  });

  test('Anular el credito', async ({ page }) => {
    //console.log(`Credito a Anular: ${numeroCFF}`);
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('button', { name: 'Anular documento' }).click();

    await busquedaDoc(page, iframe, numeroCFF);

    await iframe.getByRole('cell', { name: numeroCFF }).click();

    const confirmButton = iframe.locator('#btnConfirmNull');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    const proceedButton = iframe.getByRole('button', { name: 'Si - proceder' });
    await expect(proceedButton).toBeVisible();
    await proceedButton.click();

    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, numeroCFF);

    await expect(
      iframe.getByRole('row', { name: numeroCFF })
    ).toHaveCount(0);
  });
});