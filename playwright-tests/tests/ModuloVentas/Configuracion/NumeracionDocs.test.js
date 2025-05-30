import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { login } from '@helpers/login.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage.js';
import { randomUUID } from 'crypto';

test.describe.serial('Numeracion de Documentos', () => {
  let page;
  let context;
  let iframe;
  const uniqueId = randomUUID().slice(-8);

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
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.NUMERACION_DOCUMENTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar documento', async () => {
    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.getByRole('option', { name: 'Oficina central 01', exact: true }).click();

    await iframe.getByRole('button', { name: 'Agregar Numeración de documentos por sucursal' }).click();
    await iframe.getByRole('textbox', { name: 'Tipo de documento:' }).click();
    await iframe.getByRole('option', { name: 'Abono a Factura 03' }).click();
    await iframe.getByRole('textbox', { name: 'Serie' }).fill(uniqueId);

    await iframe.getByRole('spinbutton', { name: 'Ultimo numero emitido' }).fill('0');
    await iframe.getByRole('spinbutton', { name: 'Pr[oximo numero a imprimir' }).fill('1'); //El campo tiene error ortografico
    await iframe.getByRole('spinbutton', { name: 'Talonario/numeracion desde el #:' }).fill('1');
    await iframe.getByRole('spinbutton', { name: 'Talonario/numeracion hasta el #:' }).fill('1000');

    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test('Editar documento', async () => {
    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.getByRole('option', { name: 'Oficina central 01', exact: true }).click();
    await iframe.getByRole('cell', { name: 'Abono a Factura' }).click();
    await iframe.getByRole('spinbutton', { name: 'Ultimo numero emitido' }).fill('1');
    await iframe.getByRole('button', { name: 'Actualizar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test('Eliminar documento', async () => {
    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.getByRole('option', { name: 'Oficina central 01', exact: true }).click();

    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await iframe.getByRole('row', { name: 'Abono a Factura' }).getByRole('button').click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
  });

});