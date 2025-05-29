const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('Modulo Compras - Compras a sujetos excluidos', () => {
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

  test('Agregar, grabar, buscar y anular registro', async () => {
    let documentValue = '';

    // Agregar item a la tabla
    await page.getByRole('link', { name: 'Compras a sujetos excluidos' }).click();
    await test.step('Agregando Item a tabla', async () => {
      await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();

      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Item' }).click();

      const optionLocator = iframe.locator('[role="option"][data-index="2"]');
      const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
      await optionLocator.click();

      await iframe.getByRole('spinbutton', { name: 'Costo unit' }).fill('100');
      await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
      await iframe.locator('#btnConfirmAddLine').click();
      await expect(iframe.getByRole('cell', { name: value })).toBeVisible();

      documentValue = await iframe.locator('input#coddoc').inputValue();
    });

    // Grabar documento
    await test.step('Grabar documento', async () => {
      await iframe.getByRole('textbox', { name: 'Comprador', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('button', { name: 'Grabar documento' }).click();
      // Puedes agregar aquí un expect para el toast si lo deseas
    });

    // Verificar registro agregado por medio de búsqueda
    await test.step('Verificar registro agregado por medio de busqueda', async () => {
      await iframe.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Buscar' }).click();
      await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
      await iframe.getByRole('button', { name: 'Cancelar' }).click();
    });

    // Anular documento
    await test.step('Anular documento', async () => {
      await iframe.getByRole('button', { name: 'Anular documento' }).click();
      await iframe.getByRole('button', { name: 'Buscar' }).click();
      await iframe.getByRole('row', { name: documentValue }).click();

      let errorAlert = null;
      page.on('dialog', async (dialog) => {
        const message = dialog.message();
        if (message.includes('No es posible anular documento')) {
          errorAlert = message;
        }
        await dialog.accept();
      });

      await iframe.locator('#btnConfirmNull').click();
      await page.waitForTimeout(500);
      expect(errorAlert).toBeNull();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();

      await expect(iframe.getByRole('cell', { name: documentValue })).not.toBeVisible();
    });
  });
});