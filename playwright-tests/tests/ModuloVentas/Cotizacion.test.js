import { test, expect } from '@playwright/test';
import { crearCotizacion } from '@helpers/crearCotizacion';
import { busquedaDoc } from '@helpers/busquedaDoc';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { VentasPage } from '@POM/ventasPage';

test.describe.serial('Cotización', () => {
  let page;
  let context;
  let iframe;
  let documentValue = '';

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
    await ventasPage.goToSubModule(VentasPage.MAIN.COTIZACION);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear Cotización', async () => {
    documentValue = await crearCotizacion(page, iframe);
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editar Cotización', async () => {
    if (!documentValue) documentValue = await crearCotizacion(page, iframe);

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    // Editar Vendedor
    await iframe.getByRole('textbox', { name: 'Vendedor' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await iframe.getByRole('button', { name: 'Cancel' }).click();

    // Verificar cambios
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(
      iframe.getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' }) // Ajusta el nombre si es necesario
    ).toBeVisible();
  });

  test('Anular Cotización', async () => {
    if (!documentValue) documentValue = await crearCotizacion(page, iframe);

    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Cambios han sido grabados');

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    const row = iframe.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});