const { test, expect } = require('@playwright/test');
const credentials = require('../../../config/credentials.js');
const { login } = require('../../helpers/login.js');

test.describe.serial('Conceptos de Gastos', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login
    await test.step('Login', async () => {
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByText('Conceptos de gastos').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  // Por el momento no se puede eliminar un concepto y limpiar datos 
  // por lo que se dejara esta prueba en estado skip.
  test.skip('Agregar concepto', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: ' Código' }).fill('99');
    await iframe.getByRole('textbox', { name: 'Descripción del concepto de gastos' })
      .fill('Concepto prueba (Agregado)');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test.skip('Modificar concepto', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill('99');
    await expect(iframe.getByRole('cell', { name: '99' })).toBeVisible();
    await iframe.getByRole('row', { name: '99' }).getByRole('button').nth(0).click();

    await iframe.getByRole('textbox', { name: 'Descripción del concepto de gastos' })
      .fill('Concepto prueba (Modificado)');
    await iframe.getByRole('button', { name: 'Grabar cambios' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro modificado');
  });

  test.skip('Eliminar concepto', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar' }).fill('99');
    await expect(iframe.getByRole('cell', { name: '99' })).toBeVisible();
    await iframe.getByRole('row', { name: '99' }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();

    await iframe.getByRole('button', { name: 'Aceptar' }).click();
    
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro eliminado');
  });
});