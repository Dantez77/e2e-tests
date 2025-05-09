const { test, expect } = require('@playwright/test');
const { crearFactura } = require('../helpers/crearFactura');
const { busquedaDoc } = require('../helpers/busquedaDoc');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Factura', () => {
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
    // Navigate to "Factura" section
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Factura', exact: true }).click();
  });

  test.afterAll(async () => {
    // Clean up resources
    await page.close();
    await context.close();
  });

  test('Factura', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Facturacion, esto incluye:
    // - Crear un documento de facturacion (indice de exito: Verificacion de documento creado) - INCOMPLETO FALTA VERIFICACION
    // - Editar un documento de facturacion (indice de exito: Verificacion de documento editado) - COMPLETO
    // - Anular un documento de facturacion (indice de exito: Verificacion de que el documento fue anulado) - COMPLETO
    // - Obtener cotizacion -PENDIENTE <============

    const iframeElement = page.frameLocator('iframe');
    let documentValue = ''; //Facturas posee un id auto generado, usamos esta variable para extraerlo y verificacion

    await test.step('Grabando un nuevo documento', async () => {
      documentValue = await crearFactura(page, iframeElement);
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
      await expect(iframeElement.getByRole('row', { name: documentValue })).toBeVisible();
    });

    await test.step('Editando el documento creado', async () => {
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
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();

      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();
      
      await iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' }).click();

      await iframeElement.locator('#btnConfirmNull').click();


      await page.waitForTimeout(500);

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500)

      //Confirmar que fue anulado
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();

      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();

      await expect(iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'John Doe' })).toHaveCount(0);
    });

  });
});