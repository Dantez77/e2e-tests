import { test, expect } from '@playwright/test';
import { crearCreditoFiscal } from '@helpers/crearCreditoFiscal';
import { crearNota } from '@helpers/crearNota';
import { busquedaDoc } from '@helpers/busquedaDoc';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { VentasPage } from '@POM/ventasPage';

test.describe('Nota de Débito', () => {
  let page;
  let context;
  let iframe;
  let numeroCFF;
  let documentValue;
  const tipoPago = 'Credito';
  const tipoNota = 'Nota de débito';
  const newVendor = 'Bob';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login 
    await test.step('Login', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.login(credentials);
    });

    await test.step('Crear credito', async () => {
      const ventasPage = new VentasPage(page);
      await ventasPage.goToSubModule(VentasPage.MAIN.CREDITO_FISCAL);
      numeroCFF = await crearCreditoFiscal(page, iframe, tipoPago);
    });
  });

  test.beforeEach(async () => {
    const ventasPage = new VentasPage(page);
    await ventasPage.goToSubModule(VentasPage.MAIN.NOTA_DE_DEBITO);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Creación de Nota de Debito', async () => {
    documentValue = await crearNota(page, iframe, numeroCFF, tipoNota);
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Documento aplicado correctamente');
  });

  test('Buscar Nota de Débito', async () => {
    await iframe.getByRole('button', { name: 'Buscar documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
  });

  test('Editando Nota de Débito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="1"]').click();

    await expect(iframe.getByRole('button', { name: 'Grabar cambios' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();

    // Luego de grabar cambios regreso a la pagina principal de notas de débito y vuelvo a buscar
    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    await expect(
      iframe.getByRole('row', { name: documentValue }).getByRole('cell', { name: newVendor })
    ).toBeVisible();
  });

  test('Anulando Nota de Débito', async () => {
    test.skip(!documentValue, 'No document created');
    await iframe.getByRole('button', { name: 'Anular Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);
    await iframe.getByRole('cell', { name: documentValue }).click();

    await expect(iframe.locator('#btnConfirmNull')).toBeVisible();
    await iframe.locator('#btnConfirmNull').click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await iframe.getByRole('button', { name: 'Buscar Documento' }).click();
    await busquedaDoc(page, iframe, documentValue);

    const row = iframe.locator('tr', { hasText: documentValue });
    await expect(row).toHaveCount(0);
  });
});