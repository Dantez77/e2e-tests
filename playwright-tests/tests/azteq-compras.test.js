const { test, expect } = require('@playwright/test');

/*
  Recordar cambiar correo y usuario antes de que se me acabe el plan de prueba o____o. 
*/

test.describe('Modulo Compras', () => {
  let page;
  let context;

  const credentials = {
    username: 'danq97@gmail.com',
    password: '1234',
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await test.step('Login and enter modulo compras', async () => {
      await page.goto('https://azteq.club/azteq-club/login/');
      await page.fill('#username', credentials.username);
      await page.fill('#password', credentials.password);
      await page.locator('#goLogin1').click();
      await expect(page.locator('#login2')).toBeVisible();

      await page.locator('#cdsuc').click();
      await page.getByRole('option', { name: 'Oficina central', exact: true }).click();
      await page.locator('#goLogin2').click();

      await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
      await expect(page).toHaveURL(/.*menu\/menu\.php/);

      const comprasBtn = page.getByRole('link', { name: 'btn-moduloCompras' });
      await expect(comprasBtn).toBeVisible();
      await comprasBtn.click();
    });
  });

  //to get into the module fresh each time before a test
  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot

  /*
  ======== Funciones del modulo compras ==========
  */

  //All page elements and module specific options loaded and are visible
  test('All page elements loaded and are visible', async () => {
    expect(page.getByRole('link', { name: 'Compras', exact: true }));

    //Module specific options
    await expect(page.getByRole('link', { name: 'Compras locales' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Compras a sujetos excluidos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pólizas de importación' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Compras al exterior' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Retaceo de costos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Proveedores', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Grupos de proveedores' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Productos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Almacenes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sucursales' })).toBeVisible();

    //
    await page.getByRole('button', { name: 'Informes y consultas' }).click();
    await expect(page.getByText('Libro de compras')).toBeVisible();
    await expect(page.getByText('Compras por producto')).toBeVisible();
    await expect(page.getByText('Compras por proveedor')).toBeVisible();
    await expect(page.getByText('Compras por fecha')).toBeVisible();
    await expect(page.getByText('Retaceo de póliza de')).toBeVisible();
    await expect(page.getByText('Compras por sucursal')).toBeVisible();
    await expect(page.getByText('Retenciones 1% IVA')).toBeVisible();
    await expect(page.getByText('Exportación archivos .csv')).toBeVisible();

    //Settings 
    await page.getByRole('button', { name: 'Configuración' }).click();
    await expect(page.getByText('Período de trabajo')).toBeVisible();
    await expect(page.getByText('Conceptos de gastos')).toBeVisible();
    await expect(page.getByText('Datos de la empresa')).toBeVisible();
    await expect(page.getByText('Compras con número provisional')).toBeVisible();
    await expect(page.getByText('Numeración de documentos')).toBeVisible();
    await expect(page.getByText('Logo de la empresa')).toBeVisible();
    await expect(page.getByText('Transferencias con número')).toBeVisible();
    await expect(page.getByText('Compradores')).toBeVisible();
    await expect(page.getByText('Generar CSE de nómina')).toBeVisible();

    //
    await page.getByRole('button', { name: 'Facturación electrónica' }).click();
    await expect(page.getByText('Revisión / envío de DTEs')).toBeVisible();
    await expect(page.getByText('Consulta / Re-envío de DTEs')).toBeVisible();
  });

  //===============================================================================
  //Compras Locales
  //===============================================================================

  test('Compras locales: Agregar al registro', async () => {
    //Datos necesarios para que este test funcione: Item (producto), Precio unitario, Proveedor.
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `P-` + `${Date.now()}`.slice(-7);
    const producto = `Producto ` + `${Date.now()}`.slice(-4);


    await page.getByRole('link', { name: 'Productos', exact: true }).click();

    await test.step('Agregando el item a la tabla', async () => {

      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframeElement.getByRole('textbox', { name: 'Descripcion', exact: true }).fill(producto);

      await iframeElement.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByText('NoSí').first().click(); // Insumo
      await iframeElement.getByText('NoSí').nth(2).click();  // Solo maneja unidades completas
      await iframeElement.getByText('NoSí').nth(1).click();  // Este producto de puede vender

      await iframeElement.getByText('Contables').click();

      await iframeElement.getByRole('textbox', { name: 'Concepto de gastos de importación' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();


      await iframeElement.getByText('Precios').click();
      await iframeElement.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('20');
      await iframeElement.getByRole('spinbutton', { name: 'Precio 2 SIN IVA' }).fill('22');

      await iframeElement.getByRole('button', { name: 'Grabar' }).click();
      await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);

      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
    });
  });

  //Borrar elementos del registro
  test('Compras locales: Borrar elementos del registro', async () => {
    //Datos necesarios para que este test funcione: Item (producto), Precio unitario, Proveedor.

    const iframeElement = page.frameLocator('iframe');

    //Entrando a compras locales y agragando un elemento al registro
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframeElement.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframeElement.locator('[role="option"][data-index="1"]');
    const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
    await optionLocator.click();
    await iframeElement.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('100');
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframeElement.locator('#btnConfirmAddLine').click(); // Confirmacion

    //Ver el registro que vamos a borrar existe
    await expect(iframeElement.getByRole('cell', { name: value })).toBeVisible();

    //La accion de borrar se ejecuta luego de la confirmacion de un dialogo
    //Playwright bloquea estos mensajes por default, asi que hay que poner esto para que salga
    //Cuando salga el dialogo es inmediatamente aceptado
    page.once('dialog', async (dialog) => {
      console.log('Dialog text:', dialog.message());
      await dialog.accept(); // or dialog.dismiss() for Cancel
    });
    //Boton para eliminar registro
    await iframeElement.getByRole('row', { name: value }).getByRole('button', { name: 'Delete' }).click();

    //Verificamos que el item ya no existe
    await expect(iframeElement.getByRole('cell', { name: value })).not.toBeVisible();
  });

  test('Compras locales: Grabar documento', async () => {
    const iframeElement = page.frameLocator('iframe');
    const numeroFactura = `test-${Date.now()}`;

    //Entrando a compras locales y agragando un elemento al registro
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframeElement.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframeElement.locator('[role="option"][data-index="1"]');
    const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
    await optionLocator.click();
    await iframeElement.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('100');
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframeElement.locator('#btnConfirmAddLine').click(); // Confirmacion

    await iframeElement.getByRole('textbox', { name: 'Factura #' }).fill(numeroFactura);
    await iframeElement.getByRole('button', { name: 'Grabar Documento' }).click();

    //await expect(locator.innerText()).toContainText('Cambios han sido guardados');
    await page.locator('.toast', { hasText: 'Cambios han sido guardados' }).isVisible()

  });

  //Rework needed
  test('Compras locales: Buscar documento', async () => {

    const iframeElement = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Compras locales' }).click();
    await expect(iframeElement.getByRole('button', { name: 'Buscar documento' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();

    //Al entrar revisa si el registro esta vacio y una vez se da a bscar, la tabla se llena y el mensaje deberia desaparecer
    await expect(iframeElement.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Buscar' }).click();
    await expect(iframeElement.getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
  });

  //Verificar si se puede anular un doc correctamente
  test('Compras locales: Anular documento', async () => {
    const iframeElement = page.frameLocator('iframe');
    const numeroFactura = `anular-${Date.now()}`;

    //Entrando a compras locales y agragando un elemento al registro
    await page.getByRole('link', { name: 'Compras locales' }).click();
    await iframeElement.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Item' }).click();
    const optionLocator = iframeElement.locator('[role="option"][data-index="3"]');
    const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
    await optionLocator.click();
    await iframeElement.getByRole('spinbutton', { name: 'Costo total sin iva' }).fill('20');
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');
    await iframeElement.locator('#btnConfirmAddLine').click(); // Confirmacion

    await iframeElement.getByRole('textbox', { name: 'Factura #' }).fill(numeroFactura);
    await iframeElement.getByRole('button', { name: 'Grabar Documento' }).click();
    //await page.locator('.toast', { hasText: 'Documento ha sido grabado' }).toBeVisible();

    await expect(iframeElement.getByRole('button', { name: 'Anular documento' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Anular documento' }).click();
    await iframeElement.getByRole('button', { name: 'Buscar' }).click();
    await iframeElement.getByRole('row', { name: numeroFactura }).click();

    let errorAlert = null;

    page.on('dialog', async (dialog) => {
      const message = dialog.message();
      if (message.includes('No es posible anular documento')) {
        errorAlert = message;
      }
      await dialog.accept(); // or dismiss
    });

    // Anular el documento
    await iframeElement.locator('#btnConfirmNull').click();

    expect(errorAlert).toBeNull();

    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
    await iframeElement.getByRole('button', { name: 'Buscar' }).click();
    await page.waitForTimeout(500);

    //Verificar que el documento ahora posee un valor de 0.00
    await expect(iframeElement.
      getByRole('row', { name: numeroFactura }).
      getByRole('cell', { name: '0.00' })).
      toBeVisible();
  });

  test.fixme('Compras locales: Usar archivo Json', async () => {
    //TODO:
  });

  test.fixme('Compras locales: Obtener orden de compra', async () => {
    //TODO:
  });

  //===============================================================================
  //Compras a sujetos excluidos
  //===============================================================================

  test('Compras a sujetos excluidos: Agregando Registro', async () => {
    const iframeElement = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Compras a sujetos excluidos' }).click();

    let documentValue = '';

    await test.step('Agregando Item a tabla', async () => {
      // Proveedor exitente!
      await iframeElement.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      // Agregar item a la tabla
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('textbox', { name: 'Item' }).click();

      // Seleccionar item
      const optionLocator = iframeElement.locator('[role="option"][data-index="2"]');
      const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
      await optionLocator.click();

      // Detalles
      await iframeElement.getByRole('spinbutton', { name: 'Costo unit' }).fill('100');
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');

      // Confirm 
      await iframeElement.locator('#btnConfirmAddLine').click();
      await expect(iframeElement.getByRole('cell', { name: value })).toBeVisible();

      // Get the dynamic document number value from the disabled input
      documentValue = await iframeElement.locator('input#coddoc').inputValue();
      console.log('Documento generado:', documentValue);
    });

    await test.step('Grabar documento', async () => {
      await iframeElement.getByRole('textbox', { name: 'Comprador', exact: true }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();
      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();
      // await expect(iframeElement.locator('.toast')).toContainText('Documento a sido grabado');
    });

    await test.step('Verificar registro agregado por medio de busqueda', async () => {
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframeElement.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
      await iframeElement.getByRole('button', { name: 'Buscar' }).click();

      // Use the extracted dynamic value to assert visibility
      await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
      await iframeElement.getByRole('button', { name: 'Cancelar' }).click();

    });

    await test.step('Anular documento', async () => {
      await iframeElement.getByRole('button', { name: 'Anular documento' }).click();
      await iframeElement.getByRole('button', { name: 'Buscar' }).click();
      await iframeElement.getByRole('row', { name: documentValue }).click();

      let errorAlert = null;

      page.on('dialog', async (dialog) => {
        const message = dialog.message();
        if (message.includes('No es posible anular documento')) {
          errorAlert = message;
        }
        await dialog.accept(); // or dismiss
      });

      // Anular el documento
      await iframeElement.locator('#btnConfirmNull').click();

      await page.waitForTimeout(500);

      // Revisar si el mensaje de error se muestra al borrar
      expect(errorAlert).toBeNull();

      // Verificar que el documento ya no existe
      await expect(iframeElement.getByRole('cell', { name: documentValue })).not.toBeVisible();
    });
  });

  //===============================================================================
  //Polizas de importacion
  //===============================================================================

  test('Polizas de importacion: Agregar registro', async () => {
    const iframeElement = page.frameLocator('iframe');
    const numeroPl = `PL-${Date.now()}`;

    await page.getByRole('link', { name: 'Pólizas de importación' }).click();
    await expect(iframeElement.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    //Llenando el formulario
    await iframeElement.getByRole('textbox', { name: 'Póliza No.:' }).fill(numeroPl);

    await iframeElement.getByRole('textbox', { name: 'Fecha de ingreso' }).fill('2025-04-21');
    await iframeElement.getByRole('textbox', { name: 'Agencia que tramita' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    await iframeElement.getByRole('textbox', { name: 'Inicio de trámites' }).fill('2025-04-01');
    await iframeElement.getByRole('textbox', { name: 'Final de trámites' }).fill('2025-04-30');
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    //Confirmar que el registro fue creado
    await iframeElement.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframeElement.getByRole('cell', { name: numeroPl })).toBeVisible();
  });

  test('Polizas de importacion: Eliminar', async () => {
    //TODO: Implementar la lógica para eliminar un registro en pólizas de importación
    const iframeElement = page.frameLocator('iframe');
    const numeroPl = `PL-${Date.now()}`;

    await page.getByRole('link', { name: 'Pólizas de importación' }).click();
    await expect(iframeElement.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Póliza No.:' }).fill(numeroPl);
    await iframeElement.getByRole('textbox', { name: 'Fecha de ingreso' }).fill('2025-04-21');
    await iframeElement.getByRole('textbox', { name: 'Agencia que tramita' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();
    await iframeElement.getByRole('textbox', { name: 'Inicio de trámites' }).fill('2025-04-01');
    await iframeElement.getByRole('textbox', { name: 'Final de trámites' }).fill('2025-04-30');
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    await iframeElement.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframeElement.getByRole('cell', { name: numeroPl })).toBeVisible();


    let errorAlert = null;

    page.on('dialog', async (dialog) => {
      const message = dialog.message();
      if (message.includes('No es posible eliminar. Hay datos relativos')) {
        errorAlert = message;
      }
      await dialog.dismiss(); // dismiss the dialog
    });

    await iframeElement.getByRole('row', { name: numeroPl }).getByRole('button').nth(1).click();

    expect(errorAlert).toBeNull(); //Si se muestra el mensaje de error, la prueba falla    
  });


  //===============================================================================
  //Compras al exterior
  //===============================================================================

  test('Compras al exterior: Agregar al registro', async () => {
    const iframeElement = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Compras al exterior' }).click();

    let documentValue = '';
    let numeroFactura = `F-${Date.now()}`;
    let numeroBl = `BL-${Date.now()}`;


    await test.step('Agregando Item a tabla', async () => {
      // Proveedor exitente
      await iframeElement.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      // Agregar item a la tabla
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('textbox', { name: 'Producto' }).click();
      const optionLocator = iframeElement.locator('[role="option"][data-index="1"]');
      const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]').innerText();
      await optionLocator.click();

      // Detalles requeridos
      await iframeElement.getByRole('spinbutton', { name: 'Costo unit' }).fill('100');
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');

      // Confirm
      await iframeElement.locator('#btnConfirmAddLine').click();
      await expect(iframeElement.getByRole('cell', { name: value })).toBeVisible();

      documentValue = await iframeElement.locator('input#coddoc').inputValue(); //Guarde en caso que se usara en tabla luego
      //console.log('Documento generado:', documentValue);
    });

    await test.step('Grabar documento', async () => {
      await iframeElement.getByRole('textbox', { name: 'Número de BL' }).fill(numeroBl);
      await iframeElement.getByRole('textbox', { name: 'Factura proveedor:' }).fill(numeroFactura);
      await iframeElement.getByRole('textbox', { name: 'Poliza de importación' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();
      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();
    });

    await test.step('Verificar registro agregado por medio de busqueda', async () => {
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframeElement.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
      await iframeElement.getByRole('button', { name: 'Buscar' }).click();
      await expect(iframeElement.getByRole('cell', { name: numeroFactura })).toBeVisible();

      await iframeElement.getByRole('button', { name: 'Cancelar' }).click(); //Salir de la ventana de busqueda
    });

    await test.step('Anular documento', async () => {
      await iframeElement.getByRole('button', { name: 'Anular documento' }).click();
      await iframeElement.getByRole('button', { name: 'Buscar' }).click();
      await iframeElement.getByRole('row', { name: numeroFactura }).click();

      let errorAlert = null;

      page.on('dialog', async (dialog) => {
        const message = dialog.message();
        if (message.includes('No es posible anular documento')) {
          errorAlert = message;
        }
        await dialog.accept(); // or dismiss
      });

      // Anular el documento
      await iframeElement.locator('#btnConfirmNull').click();

      expect(errorAlert).toBeNull();

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Buscar' }).click();
      await page.waitForTimeout(500);

      //Verificar que el documento ahora posee un valor de 0.00
      await expect(iframeElement.
        getByRole('row', { name: numeroFactura }).
        getByRole('cell', { name: '0.00' })).
        toBeVisible();

    });
  });

  //===============================================================================
  // Retaceo de costos
  //===============================================================================  

  test.fixme('Retaceo de costos: test 1', async () => {
    const iframeElement = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Retaceo de costos' }).click();
    //Los campos revelantes estan vacios
    await expect(iframeElement.locator('#grid_gastos')
      .getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await expect(iframeElement.contentFrame().locator('#jsgrid_div')
      .getByRole('cell', { name: 'Documento vacío' })).toBeVisible();


    await iframeElement.getByRole('textbox', { name: 'Poliza:' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    // Revisar que se lleno todo
    await expect(iframeElement.locator('#grid_gastos').
      getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
    await expect(iframeElement.contentFrame().locator('#jsgrid_div').
      getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();

    //Agregar datos para el retaceo (Asegurarse de que los dato existan, escoger entre los predefinidos)

    await page.iframeElement.getByRole('cell', { name: 'Seguros' }).click();
    await page.iframeElement.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await page.iframeElement.getByRole('button', { name: 'Actualizar' }).click();

    await page.iframeElement.getByRole('cell', { name: 'Otros gastos' }).click();
    await page.iframeElement.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await page.iframeElement.getByRole('button', { name: 'Actualizar' }).click();


  });

  //Al intentar agregar un item a la tabla no deberia ser posible y un mensaje de advertencia deberia aparecer
  test('Proveedores: Adding item to table without all required values', async () => {
    const iframeElement = page.frameLocator('iframe');

    //Click on Proveedores
    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Proveedores Close' })).toBeVisible();

    //Click on Agregar
    await expect(iframeElement.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    //Check for required field messages
    await expect(iframeElement.locator('#parsley-id-7').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-17').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-19').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-27').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-37').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-41').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-45').getByText('Este valor es requerido.')).toBeVisible();
    await expect(iframeElement.locator('#parsley-id-51').getByText('Este valor es requerido.')).toBeVisible();

  });

  test.fixme('Proveedores: Agregando a tabla', async () => {
    //iframe context
    const iframeElement = page.frameLocator('iframe');
    const idProveedor = `PV-`+`${Date.now()}`.slice(-7);
    const nombreProveedor = `Proveedor `+`${Date.now()}`.slice(-4);


    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();
    
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();


    await iframeElement.getByRole('textbox', { name: 'Codigo Este valor es' }).fill('1234');

    await iframeElement.getByRole('textbox', { name: 'Tipo de persona' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    await iframeElement.getByRole('textbox', { name: 'Nombre' }).click();
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'Nombre' }).fill('proveedor 00x');

    await page.locator('iframe').contentFrame().locator('#dirprov').click();
    await page.locator('iframe').contentFrame().locator('#dirprov').fill('calle 1, ciudad 1, pais 1');
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'Pais', exact: true }).click();
    await page.locator('iframe').contentFrame().getByRole('option', { name: 'af Afganistán af' }).click();
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'NIT' }).click();
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'NIT' }).fill('1234151');
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'Teléfono:' }).click();
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'Teléfono:' }).fill('12351234');
    await page.locator('iframe').contentFrame().getByRole('button', { name: 'Grabar' }).click();
    await page.locator('iframe').contentFrame().getByRole('textbox', { name: 'Email: Este valor es' }).fill('mail@mail.com');
    await page.locator('iframe').contentFrame().getByRole('button', { name: 'Grabar' }).click();
  });


  test.fixme('Proveedores: Deleting item from table', async () => {
    //iframe context
    const iframeElement = page.frameLocator('iframe');
    const idProveedor = `PV-`+`${Date.now()}`.slice(-7);



    //Click on Proveedores
    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Proveedores Close' })).toBeVisible();

    //Deletes item added in 'proveedores: adding to table test'
    const row = iframeElement.getByRole('row', { name: '001 99999999999 Apellido,' });

    const rowAppeared = await row.waitFor({ timeout: 5000 }).then(() => true).catch(() => false);
    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot

    if (rowAppeared) {
      const deleteButton = row.getByRole('button').nth(1);
      await deleteButton.click();
      await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    }
    await expect(row).toHaveCount(0);
  });

  //ATM its not possible to delete items from the table and its possible 
  // to have duplicate items so its tough writting a test for this 
  //TODO: 
  test.fixme('Grupos de proveedores: adding to table', async () => {
    const iframeElement = page.frameLocator('iframe');
    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill('001');
    await iframeElement.getByRole('textbox', { name: 'Nombre del grupo' }).fill('prueba1');
    //If it fails here its because this test was written was a specific case in mind 
    //and the item from the table already exists
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    // expect(page.locator('.mbsc-toast')).toHaveText('Ya existe en la base de datos');

    await expect(iframeElement.getByRole('cell', { name: '001' })).toBeVisible();
    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot
  });


  //Prueba sera reescrita una vez la funcion se arreglada, por ahora esta con datos quemados
  test.fixme('Grupos de proveedores: deleting items from table', async () => {
    const iframeElement = page.frameLocator('iframe');
    const frame = await page.locator('iframe').first().contentFrame();

    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();

    //Cambiar luego
    await expect(page.locator('iframe').contentFrame().getByRole('cell', { name: '001' })).toBeVisible();


    await iframeElement.getByRole('row', { name: 'prueba1' }).getByRole('button').nth(1).click();
    await iframeElement.getByRole('button', { name: 'Cancelar' }).click();
    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot

    //await expect(page.locator('iframe').contentFrame().getByRole('cell', { name: '001' })).toBeVisible();
    //Check if the item is still there
    await expect(frame.getByRole('row', { name: '001' })).toHaveCount(0);


  });

  //Add productos to table in 'Prodcutos' 
  test('Productos: Add product', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`;

    await page.getByRole('link', { name: 'Productos' }).click();

    //Fill form to add a new product
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Descripcion', exact: true }).fill('descripcion producto');
    await iframeElement.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframeElement.getByText('Metro', { exact: true }).click();
    await iframeElement.getByText('Contables').click();
    await iframeElement.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframeElement.getByText('Costo artículos producidos/').click();
    await iframeElement.getByText('Precios').click();
    await iframeElement.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('100');

    //Save and add to list
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    await page.locator('iframe').contentFrame().getByLabel('Mostrar 102550100 registros').selectOption('100');
    await expect(iframeElement.getByRole('cell', { name: uniqueId, exact: true })).toBeVisible();

    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot
  });

  //Delete item from table Productos
  //Test keeps giving false positives from time to time. 
  test('Productos: Delete product', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`;

    await page.getByRole('link', { name: 'Productos' }).click();

    // Fill form
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Descripcion', exact: true }).fill('descripcion producto');
    await iframeElement.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframeElement.getByText('Metro', { exact: true }).click();
    await iframeElement.getByText('Contables').click();
    await iframeElement.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframeElement.getByText('Costo artículos producidos/').click();
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    // Wait for save to complete
    await page.locator('iframe').contentFrame().getByLabel('Mostrar 102550100 registros').selectOption('100');

    // Wait for product to appear
    const cellLocator = iframeElement.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible({ timeout: 5000 }); // Wait until it's there

    // Find the row that contains that unique ID
    const rowLocator = iframeElement
      .locator('tr')
      .filter({ has: cellLocator });

    // Use text match for delete button or more specific role if possible
    await rowLocator.locator('button').nth(1).click();

    // Confirm deletion
    await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframeElement.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    // Wait until the cell is gone
    await expect(cellLocator).toHaveCount(0, { timeout: 5000 });
  });

  //Agrega un item a la tabla de almacenes
  //Por la forma que se genera el id, puede que el test falle si no hay cuidado de borrar tablas
  //
  test.skip('Almacenes: Add item to table', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);

    //Almacenes
    await page.getByRole('link', { name: 'Almacenes' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen1');
    await iframeElement.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframeElement.getByLabel('0', { exact: true }).getByText('01').click();
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();

    const cellLocator = iframeElement.getByRole('cell', { name: uniqueId, exact: true });

    await expect(cellLocator).toBeVisible();

  });

  //Delete item from table 'Almacenes'
  test.skip('Almacenes: Delete item from table', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);

    //First create item to be deleted
    await page.getByRole('link', { name: 'Almacenes' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen1');
    await iframeElement.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframeElement.getByLabel('0', { exact: true }).getByText('01').click();
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();
    const cellLocator = iframeElement.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible();

    //await cellLocator.locator('button').nth(1).click();
    await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await expect(iframeElement.getByRole('button', { name: 'Eliminar' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Eliminar' }).click();

    await expect(iframeElement.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    await page.waitForTimeout(500);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).not.toBeVisible();
  });

  // Ocurre el caso que solo se puden tener un numero limitado de almacenes y al tener los tests
  // separados, y no borrar los los del test de crear almacenes, se llega al limite rapidamente 
  // hasta que ya no se puede crear mas almacenes en el test de borrar almacenes y el test falla 
  // por lo que se corran los tests juntos por medio de steps
  test('Almacenes: Crear y Eliminar almacenes', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);

    //First create item to be deleted
    await page.getByRole('link', { name: 'Almacenes' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen' + uniqueId);
    await iframeElement.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframeElement.getByLabel('0', { exact: true }).getByText('01').click();
    await iframeElement.getByRole('button', { name: 'Grabar' }).click();
    const cellLocator = iframeElement.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible();

    //await cellLocator.locator('button').nth(1).click();
    await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await expect(iframeElement.getByRole('button', { name: 'Eliminar' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Eliminar' }).click();

    await expect(iframeElement.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

    await page.waitForTimeout(500);
    await expect(iframeElement.getByRole('cell', { name: uniqueId })).not.toBeVisible();

  });



  //Por ahora no es posible ya que la pagina no funciona correctamente
  test.skip('Sucursales: test 1', async () => {
    //TODO: Crear y borrar sucursales 
    // Por ahora no se pueden borrar asi que se trabajara despues
  });

});