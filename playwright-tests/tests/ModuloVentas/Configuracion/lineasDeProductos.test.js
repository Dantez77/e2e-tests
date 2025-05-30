import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage.js';
import { randomUUID } from 'crypto';

test.describe.serial('Lineas de productos', () => {
  let page;
  let context;
  let iframe;
  const uniqueId = randomUUID().slice(-6);

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
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.LINEAS_DE_PRODUCTOS);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.skip('Agregar lineas de productos', async () => {
    //TODO: FUNCIONALIDAD YA SE PRUEBA EN EL MODULO DE INVENTARIO
  });
});