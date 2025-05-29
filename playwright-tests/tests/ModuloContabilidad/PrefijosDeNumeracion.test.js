const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe.serial('Prefijos de numeración', () => {
  let page;
  let context;
  let iframe;
  const nomNumeracion = 'Prefijo de prueba';
  const nomNumEditado = 'Prefijo prueba editado';
  const codPrefijo = 'P' + `${Date.now()}`.slice(-2);

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
    const contabilidadBtn = page.getByRole('link', { name: 'btn-moduloContabilidad' });
    await expect(contabilidadBtn).toBeVisible();
    await contabilidadBtn.click();
    await page.getByRole('link', { name: 'Prefijos de numeración', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Crear prefijo de numeración', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Prefijo' }).fill(codPrefijo);
    await iframe.getByRole('textbox', { name: 'Nombre de la numeración' }).fill(nomNumeracion);
    await iframe.getByRole('spinbutton', { name: 'Ultimo número' }).fill('1');
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Editar prefijo de numeración', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('P');
    await iframe.getByRole('row', { name: nomNumeracion }).first().getByRole('button').nth(0).click();
    await iframe.getByRole('textbox', { name: 'Nombre de la numeración' }).fill(nomNumEditado);
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    await expect(iframe.getByRole('cell', { name: nomNumEditado })).toBeVisible();
  });

  test('Eliminar prefijo de numeración', async () => {
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill('P');
    await iframe.getByRole('row', { name: /prueba/ }).first().getByRole('button').nth(1).click(); 
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await expect(iframe.getByRole('cell', { name: nomNumEditado })).toHaveCount(0);
  });
}); 