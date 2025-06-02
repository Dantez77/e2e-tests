import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('Grupos de Proveedores', () => {
  let page;
  let context;
  let iframe;
  const uniqueCode = `GP-${Date.now()}`.slice(-6);
  const groupName = `Grupo ${Date.now()}`.slice(-4);

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
    const comprasPage = new ComprasPage(page);
    await comprasPage.goToSubModule(ComprasPage.MAIN.GRUPOS_DE_PROVEEDORES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test.skip('Agregar grupo de proveedores', async () => {
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