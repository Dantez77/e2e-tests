const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('lmacenes', () => {
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

  test('Agregar, Editar y Eliminar Almacen', async () => {
    const uniqueId = `99`;

    await page.getByRole('link', { name: 'Almacenes' }).click();

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