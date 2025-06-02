import { test, expect } from '@playwright/test';
import credentials from '@config/credentials.js';
import { LoginPage } from '@POM/loginPage';
import { ComprasPage } from '@POM/comprasPage';

test.describe('lmacenes', () => {
  let page;
  let context;
  let iframe;
  const uniqueId = `99`;

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
    await comprasPage.goToSubModule(ComprasPage.MAIN.ALMACENES);
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar, Editar y Eliminar Almacen', async () => {
    // Crear
    await test.step('Agregar almacen', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframe.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen XX');
      await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('button', { name: 'Grabar' }).click();

      // Verificar que fue creado
      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();
    });

    // Editar
    await test.step('Editar almacen', async () => {
      await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(0).click();
      await iframe.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen ' + uniqueId);
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await expect(
        iframe.getByRole('row', { name: uniqueId }).getByRole('cell', { name: 'almacen ' + uniqueId })
      ).toBeVisible();
    });

    // Eliminar
    await test.step('Eliminar almacen', async () => {
      await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
      await iframe.getByRole('button', { name: 'Eliminar' }).click();
      await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500);
      await expect(iframe.getByRole('cell', { name: uniqueId })).not.toBeVisible();
    });
  });
});