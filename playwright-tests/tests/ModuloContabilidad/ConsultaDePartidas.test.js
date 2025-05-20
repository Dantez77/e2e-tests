const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Consulta de Partidas', () => {
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
    const contabilidadBtn = page.getByRole('link', { name: 'btn-moduloContabilidad' });
    await expect(contabilidadBtn).toBeVisible();
    await contabilidadBtn.click();
    await page.getByRole('link', { name: 'Consulta de partidas', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Busqueda de partidas contables', async () => {
    //TODO: Busqueda de partidas contables 
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Buscar' }, { exact: true }).click();
    await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
  });

  test('Navegacion consulta de partidas contables', async () => {
    //TODO: Navegacion entre partidas contables
    await iframe.getByRole('button', { name: 'Buscar' }, { exact: true }).click();
    await iframe.getByRole('cell', { name: 'P01' }).first().click();
    await expect(iframe.getByRole('button', { name: '<-- Anterior' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Siguiente -->' })).toBeVisible();
    await expect(iframe.getByRole('button', { name: 'Regresar a búsqueda' })).toBeVisible();      
    await iframe.getByRole('button', { name: 'Regresar a búsqueda' }, { exact: true }).click();
    await expect(iframe.getByRole('heading', { name: 'Buscar partida contable' })).toBeVisible();      

  });

  test.fixme('Imprimir partida contable', async () => {
    //TODO: Imprimir de partida contable
    await iframe.getByRole('button', { name: 'Buscar' }, { exact: true }).click();
    await iframe.getByRole('cell', { name: 'P01' }).first().click();

  });
});