const { test, expect } = require('@playwright/test');
const { busquedaDoc } = require('../helpers/busquedaDoc.js');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Factura de Exportación', () => {
  let page;
  let context;
  let iframeElement;
  let documentValue;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');

    // Login and navigate to "Modulo Ventas"
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  test.beforeEach(async () => {
    // Navigate to "Factura de Exportación" section
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Factura de exportación', exact: true }).click();
  });

  test.afterAll(async () => {
    // Clean up resources
    await page.close();
    await context.close();
  });

  test('Factura de exportacion: Crear, Editar y Anular', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Factura de exportacion, esto incluye:
    // - Crear un documento de facturacion (indice de exito: Verificacion de documento creado) - COMPLETO
    // - Editar un documento de facturacion (indice de exito: Verificacion de documento editado) - COMPLETO
    // - Anular un documento de facturacion (indice de exito: Verificacion de que el documento fue anulado) - COMPLETO
    // - Obtener cotizacion -PENDIENTE

    const iframeElement = page.frameLocator('iframe');
    let documentValue = '';

    await test.step('Creando el documento', async () => {
      //TODO: Por ahora falta verificar el toast despues de crear documento 
      await page.waitForTimeout(500)

      documentValue = await iframeElement.locator('input#coddoc').inputValue();

      await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('textbox', { name: 'Forma de pago' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('textbox', { name: 'Fecha Embarque' }).fill('2025-05-05');
      await iframeElement.getByRole('textbox', { name: 'Via de transporte' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();

      await iframeElement.getByRole('textbox', { name: 'Recinto Fiscal' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();

      await iframeElement.getByRole('textbox', { name: 'Regimen Fiscal' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      await iframeElement.getByRole('textbox', { name: 'Código' }).click();
      await iframeElement.locator('[role="option"][data-index="4"]').click();
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('12');

      await iframeElement.locator('#btnConfirmAddLine').click();

      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();

      //Buscandolo para verificar que fue creado
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Por número' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click(); //Buscar por numero 

      await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
    });

    //Se puede mejorar esa parte extrayendo el innertext de la opcion vendedor seleccionada para mejor consistencia
    await test.step('Editando el documento', async () => {
      iframeElement.getByRole('cell', { name: documentValue }).click();
      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      //El elemento aqui se llama John Doe, pero sera diferente en caso cambien las credenciales actualmente utilizadas
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

      //Se busca otra vez
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();

      //Verificar que el documento fue editado
      await expect(iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' })).toBeVisible();
    });

    await test.step('Anulando el documento', async () => {
      await iframeElement.getByRole('button', { name: 'Cancelar' }).click();

      await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();

      await iframeElement.getByRole('button', { name: 'Por número' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('cell', { name: documentValue }).click();
      await iframeElement.locator('#btnConfirmNull').click(); //Anular

      await page.waitForTimeout(500);

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500)

      //Confirmar que fue anulado
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();

      await iframeElement.getByRole('button', { name: 'Por número' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();

      await expect(iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' })).toHaveCount(0);
    });
  });
});