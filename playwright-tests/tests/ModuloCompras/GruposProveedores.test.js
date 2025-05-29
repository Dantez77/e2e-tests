const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('Modulo Compras - Grupos de Proveedores', () => {
  let page;
  let context;
  let iframe;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, credentials);
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.skip('Agregar grupo de proveedores', async () => {
    const uniqueCode = `GP-${Date.now()}`.slice(-6);
    const groupName = `Grupo ${Date.now()}`.slice(-4);

    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueCode);
    await iframe.getByRole('textbox', { name: 'Nombre del grupo' }).fill(groupName);
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueCode);
    await expect(iframe.getByRole('cell', { name: uniqueCode })).toBeVisible();
  });

  test.skip('Eliminar grupo de proveedores', async () => {
    const uniqueCode = `GP-${Date.now()}`.slice(-6);
    const groupName = `Grupo ${Date.now()}`.slice(-4);

    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueCode);
    await iframe.getByRole('textbox', { name: 'Nombre del grupo' }).fill(groupName);
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueCode);
    await expect(iframe.getByRole('cell', { name: uniqueCode })).toBeVisible();

    // Eliminar
    await iframe.getByRole('row', { name: uniqueCode }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    await expect(iframe.getByRole('cell', { name: uniqueCode })).toHaveCount(0);
  });
});