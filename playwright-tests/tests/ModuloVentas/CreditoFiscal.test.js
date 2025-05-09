const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc.js');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Credito Fiscal', () => {
  let page;
  let context;
  let iframeElement;
  let documentValue;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

    //LOGIN -> MODULO VENTAS
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  //CREDITO FISCAL
  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Credito fiscal: Agregar, Editar y Anular', async () => {
    await test.step('Agregar un nuevo documento', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('textbox', { name: 'Almacen:' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Términos de pago' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      documentValue = await iframeElement.locator('input#coddoc').inputValue();

      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('textbox', { name: 'Código' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('10');

      await iframeElement.locator('#btnConfirmAddLine').click();
      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();

      //VERIFICAR QUE SE CREO EL DOCUMENTO
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await busquedaDoc(page, iframeElement, documentValue);
      await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
    });

    await test.step('Editar el documento creado', async () => {
      await iframeElement.getByRole('cell', { name: documentValue }).click();
      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();
      await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

      // VERIFICAR QUE SE EDITO
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await busquedaDoc(page, iframeElement, documentValue);
      await expect(
        iframeElement.getByRole('row', { name: documentValue }).getByRole('cell', { name: 'Bob' })
      ).toBeVisible();
    });

    await test.step('Anular el documento', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();
      await iframeElement.getByRole('row', { name: documentValue }).getByRole('cell', { name: 'Bob' }).click();
      await iframeElement.locator('#btnConfirmNull').click();

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

      // VERIFICAR QUE SE ANULO
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await busquedaDoc(page, iframeElement, documentValue);
      await expect(
        iframeElement.getByRole('row', { name: documentValue }).getByRole('cell', { name: 'Bob' })
      ).toHaveCount(0);
    });
  });
});