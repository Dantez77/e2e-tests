const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { LoginPage } = require('@POM/loginPage.js');
const { VentasPage } = require('@POM/ventasPage');

test.describe.serial('Libro de ventas a contribuyentes', () => {
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
    await ventasPage.goToInformesYconsultas(VentasPage.INFORMES.LIBRO_DE_VENTAS_CONTRIBUYENTES); 
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Libro de ventas a contribuyentes', async () => {
    await expect(iframe.getByRole('button', { name: 'Salida en PDF' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Salida en XLS' })).toBeVisible();
    await iframe.getByRole('textbox', { name: 'Desde fecha' }).fill('2023-05-01');
    await iframe.getByRole('textbox', { name: 'Hasta fecha' }).fill('2023-05-31');

    await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframe.getByRole('option', { name: 'Oficina central 01' }).click();

    await iframe.locator('html').click();
    await iframe.getByRole('button', { name: 'Salida en PDF' }).click();

    await expect(iframe.getByText('100', { exact: true })).toBeVisible();
  });
});