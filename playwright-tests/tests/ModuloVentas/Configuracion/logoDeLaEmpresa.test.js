import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage.js';
import { VentasPage } from '@POM/ventasPage.js';

test.describe.serial('Logo de la empresa', () => {
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
    const ventasPage = new VentasPage(page);
    await ventasPage.goToConfiguraciones(VentasPage.CONFIGURACIONES.LOGO_DE_LA_EMPRESA);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Logo de la empresa', async () => {
    await expect(iframe.getByText('Arrastre archivo aqui')).toBeVisible();
    //TODO: Reminder to improve test later...
  });
});