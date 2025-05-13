const { test, expect } = require('@playwright/test');

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

  //===============================================================================
  //Compras Locales
  //===============================================================================


  //===============================================================================
  //Compras a sujetos excluidos
  //===============================================================================

  test('Compras a sujetos excluidos: Agregando Registro', async () => {
    const iframe = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Compras a sujetos excluidos' }).click();

    let documentValue = '';

    await test.step('Agregando Item a tabla', async () => {
      // Proveedor exitente!
      await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();

      // Agregar item a la tabla
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Item' }).click();

      // Seleccionar item
      const optionLocator = iframe.locator('[role="option"][data-index="2"]');
      const value = await optionLocator.locator('div[style="font-size:10px;line-height:12px;"]')
        .innerText();
      await optionLocator.click();

      // Detalles
      await iframe.getByRole('spinbutton', { name: 'Costo unit' }).fill('100');
      await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');

      // Confirm 
      await iframe.locator('#btnConfirmAddLine').click();
      await expect(iframe.getByRole('cell', { name: value })).toBeVisible();

      // Get the dynamic document number value from the disabled input
      documentValue = await iframe.locator('input#coddoc').inputValue();
      console.log('Documento generado:', documentValue);
    });

    await test.step('Grabar documento', async () => {
      await iframe.getByRole('textbox', { name: 'Comprador', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('button', { name: 'Grabar documento' }).click();
      // await expect(iframe.locator('.toast')).toContainText('Documento a sido grabado');
    });

    await test.step('Verificar registro agregado por medio de busqueda', async () => {
      await iframe.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Buscar' }).click();

      // Use the extracted dynamic value to assert visibility
      await expect(iframe.getByRole('cell', { name: documentValue })).toBeVisible();
      await iframe.getByRole('button', { name: 'Cancelar' }).click();

    });

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
        await dialog.accept(); // or dismiss
      });

      // Anular el documento
      await iframe.locator('#btnConfirmNull').click();

      await page.waitForTimeout(500);

      // Revisar si el mensaje de error se muestra al borrar
      expect(errorAlert).toBeNull();

      // Verificar que el documento ya no existe
      await expect(iframe.getByRole('cell', { name: documentValue })).not.toBeVisible();
    });
  });

  //===============================================================================
  //Polizas de importacion
  //===============================================================================

  test('Polizas de importacion: Agregar registro', async () => {
    const iframe = page.frameLocator('iframe');
    const numeroPl = `PL-${Date.now()}`;

    await page.getByRole('link', { name: 'Pólizas de importación' }).click();
    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Agregar' }).click();

    //Llenando el formulario
    await iframe.getByRole('textbox', { name: 'Póliza No.:' }).fill(numeroPl);

    await iframe.getByRole('textbox', { name: 'Fecha de ingreso' }).fill('2025-04-21');
    await iframe.getByRole('textbox', { name: 'Agencia que tramita' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('textbox', { name: 'Inicio de trámites' }).fill('2025-04-01');
    await iframe.getByRole('textbox', { name: 'Final de trámites' }).fill('2025-04-30');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Confirmar que el registro fue creado
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframe.getByRole('cell', { name: numeroPl })).toBeVisible();
  });

  test('Polizas de importacion: Eliminar', async () => {
    //TODO: Implementar la lógica para eliminar un registro en pólizas de importación
    const iframe = page.frameLocator('iframe');
    const numeroPl = `PL-${Date.now()}`;

    await page.getByRole('link', { name: 'Pólizas de importación' }).click();
    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Póliza No.:' }).fill(numeroPl);
    await iframe.getByRole('textbox', { name: 'Fecha de ingreso' }).fill('2025-04-21');
    await iframe.getByRole('textbox', { name: 'Agencia que tramita' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Inicio de trámites' }).fill('2025-04-01');
    await iframe.getByRole('textbox', { name: 'Final de trámites' }).fill('2025-04-30');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(numeroPl);
    await expect(iframe.getByRole('cell', { name: numeroPl })).toBeVisible();


    let errorAlert = null;

    page.on('dialog', async (dialog) => {
      const message = dialog.message();
      if (message.includes('No es posible eliminar. Hay datos relativos')) {
        errorAlert = message;
      }
      await dialog.dismiss(); // dismiss the dialog
    });

    await iframe.getByRole('row', { name: numeroPl }).getByRole('button').nth(1).click();

    expect(errorAlert).toBeNull(); //Si se muestra el mensaje de error, la prueba falla    
  });


  //===============================================================================
  // Compras al exterior
  //===============================================================================

  test('Compras al exterior: Agregar al registro', async () => {
    const iframe = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Compras al exterior' }).click();

    let documentValue = '';
    let numeroFactura = `F-${Date.now()}`;
    let numeroBl = `BL-${Date.now()}`;


    await test.step('Agregando Item a tabla', async () => {
      // Proveedor exitente
      await iframe.getByRole('textbox', { name: 'Proveedor', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();

      // Agregar item a la tabla
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Producto' }).click();
      const optionLocator = iframe.locator('[role="option"][data-index="1"]');
      const value = await optionLocator
        .locator('div[style="font-size:10px;line-height:12px;"]')
        .innerText();
      await optionLocator.click();

      // Detalles requeridos
      await iframe.getByRole('spinbutton', { name: 'Costo unit' }).fill('100');
      await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('13');

      // Confirm
      await iframe.locator('#btnConfirmAddLine').click();
      await expect(iframe.getByRole('cell', { name: value })).toBeVisible();

      documentValue = await iframe.locator('input#coddoc').inputValue(); //Guarde en caso que se usara en tabla luego
      //console.log('Documento generado:', documentValue);
    });

    await test.step('Grabar documento', async () => {
      await iframe.getByRole('textbox', { name: 'Número de BL' }).fill(numeroBl);
      await iframe.getByRole('textbox', { name: 'Factura proveedor:' }).fill(numeroFactura);
      await iframe.getByRole('textbox', { name: 'Poliza de importación' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('button', { name: 'Grabar documento' }).click();
    });

    await test.step('Verificar registro agregado por medio de busqueda', async () => {
      await iframe.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframe.getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Buscar' }).click();
      await expect(iframe.getByRole('cell', { name: numeroFactura })).toBeVisible();

      await iframe.getByRole('button', { name: 'Cancelar' }).click(); //Salir de la ventana de busqueda
    });

    await test.step('Anular documento', async () => {
      await iframe.getByRole('button', { name: 'Anular documento' }).click();
      await iframe.getByRole('button', { name: 'Buscar' }).click();
      await iframe.getByRole('row', { name: numeroFactura }).click();

      let errorAlert = null;

      page.on('dialog', async (dialog) => {
        const message = dialog.message();
        if (message.includes('No es posible anular documento')) {
          errorAlert = message;
        }
        await dialog.accept(); // or dismiss
      });

      // Anular el documento
      await iframe.locator('#btnConfirmNull').click();

      expect(errorAlert).toBeNull();

      await iframe.getByRole('button', { name: 'Si - proceder' }).click();

      await iframe.getByRole('button', { name: 'Buscar documento' }).click();
      await iframe.getByRole('button', { name: 'Buscar' }).click();
      await page.waitForTimeout(500);

      //Verificar que el documento ahora posee un valor de 0.00
      await expect(iframe.
        getByRole('row', { name: numeroFactura }).
        getByRole('cell', { name: '0.00' })).
        toBeVisible();

    });
  });

  //===============================================================================
  // Retaceo de costos
  //===============================================================================  

  test.fixme('Retaceo de costos: test 1', async () => {
    const iframe = page.frameLocator('iframe');

    await page.getByRole('link', { name: 'Retaceo de costos' }).click();
    //Los campos revelantes estan vacios
    await expect(iframe.locator('#grid_gastos')
      .getByRole('cell', { name: 'Documento vacío' })).toBeVisible();
    await expect(iframe.contentFrame().locator('#jsgrid_div')
      .getByRole('cell', { name: 'Documento vacío' })).toBeVisible();


    await iframe.getByRole('textbox', { name: 'Poliza:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    // Revisar que se lleno todo
    await expect(iframe.locator('#grid_gastos').
      getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();
    await expect(iframe.contentFrame().locator('#jsgrid_div').
      getByRole('cell', { name: 'Documento vacío' })).not.toBeVisible();

    //Agregar datos para el retaceo (Asegurarse de que los dato existan, escoger entre los predefinidos)

    await page.iframe.getByRole('cell', { name: 'Seguros' }).click();
    await page.iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await page.iframe.getByRole('button', { name: 'Actualizar' }).click();

    await page.iframe.getByRole('cell', { name: 'Otros gastos' }).click();
    await page.iframe.getByRole('spinbutton', { name: 'Valor:' }).fill('13');
    await page.iframe.getByRole('button', { name: 'Actualizar' }).click();

  });

  //Al intentar agregar un item a la tabla no deberia ser posible y un mensaje de advertencia deberia aparecer
  test('Proveedores: Agregando a tabla sin llenar los campos requeridos', async () => {
    const iframe = page.frameLocator('iframe');

    //Click on Proveedores
    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Proveedores Close' })).toBeVisible();

    //Click on Agregar
    await expect(iframe.getByRole('button', { name: 'Agregar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Check for required field messages
    await expect(iframe.locator('#parsley-id-7')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-17')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-19')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-27')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-37')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-41')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-45')
      .getByText('Este valor es requerido.'))
      .toBeVisible();
    await expect(iframe.locator('#parsley-id-51')
      .getByText('Este valor es requerido.'))
      .toBeVisible();

  });

  test('Proveedores: Agregando a tabla', async () => {
    //iframe context
    const iframe = page.frameLocator('iframe');
    const idProveedor = `PV-` + `${Date.now()}`.slice(-7);
    const nombreProveedor = `Proveedor ` + `${Date.now()}`.slice(-4);

    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();

    await iframe.getByRole('button', { name: 'Agregar' }).click();

    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(idProveedor);

    await iframe.getByRole('textbox', { name: 'Tipo de persona' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('textbox', { name: 'Nombre' }).click();
    await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nombreProveedor);

    await iframe.locator('#dirprov').fill('calle 1, ciudad 1, pais 1');
    await iframe.getByRole('textbox', { name: 'Pais', exact: true }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Teléfono:' }).fill('7XXX7XXX');
    await iframe.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Verificar si fue guardado
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(idProveedor);
    await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toBeVisible();

  });

  //Test complete de proveedores
  test('Proveedores: Crear, Editar y Eliminar', async () => {
    const iframe = page.frameLocator('iframe');
    const idProveedor = `PV-` + `${Date.now()}`.slice(-7);
    const nombreProveedor = `Proveedor ` + `${Date.now()}`.slice(-4);
    const nit = `${Date.now()}`.slice(-10);

    await page.getByRole('link', { name: 'Proveedores', exact: true }).click();

    //Crear
    await test.step('Crear proveedor', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(idProveedor);
      await iframe.getByRole('textbox', { name: 'Tipo de persona' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Nombre' }).click();
      await iframe.getByRole('textbox', { name: 'Nombre' }).fill(nombreProveedor);
      await iframe.locator('#dirprov').fill('calle 1, ciudad 1, pais 1');
      await iframe.getByRole('textbox', { name: 'Pais', exact: true }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('textbox', { name: 'Teléfono:' }).fill('7XXX7XXX');
      await iframe.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
      await iframe.getByRole('button', { name: 'Grabar' }).click();

      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(idProveedor);
      await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toBeVisible();
    });

    //Editar
    await test.step('Editar proveedor', async () => {
      await iframe.getByRole('row', { name: idProveedor }).getByRole('button').first().click();
      await iframe.getByRole('textbox', { name: 'NIT' }).fill(nit);
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await expect(iframe.getByRole('cell', { name: nit, exact: true })).toBeVisible();
    });

    //Eliminar
    await test.step('Eliminar proveedor', async () => {
      await iframe.getByRole('row', { name: idProveedor }).getByRole('button').nth(1).click();
      await iframe.getByRole('button', { name: 'Eliminar' }).click();
      await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500);

      //Verificando que ya no existe
      await expect(iframe.getByRole('cell', { name: idProveedor, exact: true })).toHaveCount(0);
    });
  });

  //ATM its not possible to delete items from the table and its possible 
  // to have duplicate items so its tough writting a test for this 
  //TODO: 
  test.fixme('Grupos de proveedores: adding to table', async () => {
    const iframe = page.frameLocator('iframe');
    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill('001');
    await iframe.getByRole('textbox', { name: 'Nombre del grupo' }).fill('prueba1');
    //If it fails here its because this test was written was a specific case in mind 
    //and the item from the table already exists
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // expect(page.locator('.mbsc-toast')).toHaveText('Ya existe en la base de datos');

    await expect(iframe.getByRole('cell', { name: '001' })).toBeVisible();
    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot
  });


  //Prueba sera reescrita una vez la funcion se arreglada, por ahora esta con datos quemados
  test.fixme('Grupos de proveedores: deleting items from table', async () => {
    const iframe = page.frameLocator('iframe');
    const frame = await page.locator('iframe').first().contentFrame();

    await page.getByRole('link', { name: 'Grupos de proveedores' }).click();

    //Cambiar luego
    await expect(page.locator('iframe').contentFrame().getByRole('cell', { name: '001' }))
      .toBeVisible();


    await iframe.getByRole('row', { name: 'prueba1' }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Cancelar' }).click();
    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot

    //await expect(page.locator('iframe').contentFrame().getByRole('cell', { name: '001' })).toBeVisible();
    //Check if the item is still there
    await expect(frame.getByRole('row', { name: '001' })).toHaveCount(0);


  });

  //Add productos to table in 'Prodcutos' 
  test('Productos: Add product', async () => {
    const iframe = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`;

    await page.getByRole('link', { name: 'Productos' }).click();

    //Detalles
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Descripcion', exact: true })
      .fill('descripcion producto');
    await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByText('Contables').click();
    await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframe.getByText('Costo artículos producidos/').click();
    await iframe.getByText('Precios').click();
    await iframe.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('100');

    //Grabar
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    //Verificar que fue creado
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId, exact: true })).toBeVisible();

    //await page.screenshot({ path: 'debug1.png', fullPage: true }); //Debug screenshot
  });

  //Delete item from table Productos
  //Test keeps giving false positives from time to time. 
  test('Productos: Delete product', async () => {
    const iframe = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`;

    await page.getByRole('link', { name: 'Productos' }).click();

    // Llenar detalles
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Descripcion', exact: true })
      .fill('descripcion producto');
    await iframe.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByText('Contables').click();
    await iframe.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
    await iframe.getByText('Costo artículos producidos/').click();
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // Buscar producto
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    const cellLocator = iframe.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible(); 

    // Find the row that contains that unique ID
    const rowLocator = iframe
      .locator('tr')
      .filter({ has: cellLocator });

    // Use text match for delete button or more specific role if possible
    await rowLocator.locator('button').nth(1).click();

    // Confirm deletion
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();
    await page.waitForTimeout(500);

    // Wait until the cell is gone
    await expect(cellLocator).toHaveCount(0, { timeout: 5000 });
  });

  //Agrega un item a la tabla de almacenes
  //Por la forma que se genera el id, puede que el test falle si no hay cuidado de borrar tablas
  test('Almacenes: Agregar, Editar y Eliminar', async () => {
    const iframe = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);
    await page.getByRole('link', { name: 'Almacenes' }).click();

    //Crear
    await test.step('Agregar almacen', async () => {
      await iframe.getByRole('button', { name: 'Agregar' }).click();
      await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
      await iframe.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen XX');
      await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
      await iframe.locator('[role="option"][data-index="0"]').click();
      await iframe.getByRole('button', { name: 'Grabar' }).click();

      //Verificar que fue creado
      await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();
    });

    //Editar
    await test.step('Editar almacen', async () => {
      await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(0).click();
      await iframe.getByRole('textbox', { name: 'Nombre del almacen' })
        .fill('almacen ' + uniqueId);
      await iframe.getByRole('button', { name: 'Grabar' }).click();
      await expect(iframe.getByRole('row', { name: uniqueId })
        .getByRole('cell', { name: 'almacen ' + uniqueId }))
        .toBeVisible();
    });

    //Eliminar
    await test.step('Eliminar almacen', async () => {
      await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
      await iframe.getByRole('button', { name: 'Eliminar' }).click();

      await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
      await iframe.getByRole('button', { name: 'Si - proceder' }).click();

      await page.waitForTimeout(500);
      await expect(iframe.getByRole('cell', { name: uniqueId })).not.toBeVisible();
    });

  });

  //Delete item from table 'Almacenes'
  test.skip('Almacenes: Delete item from table', async () => {
    const iframe = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);

    //First create item to be deleted
    await page.getByRole('link', { name: 'Almacenes' }).click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Nombre del almacen' }).fill('almacen1');
    await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframe.getByLabel('0', { exact: true }).getByText('01').click();
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    const cellLocator = iframe.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible();

    //await cellLocator.locator('button').nth(1).click();
    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await expect(iframe.getByRole('button', { name: 'Eliminar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();

    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await page.waitForTimeout(500);
    await expect(iframe.getByRole('cell', { name: uniqueId })).not.toBeVisible();
  });

  test.skip('Almacenes: Crear y Eliminar almacenes', async () => {
    const iframe = page.frameLocator('iframe');
    const uniqueId = `${Date.now()}`.slice(-2);

    //First create item to be deleted
    await page.getByRole('link', { name: 'Almacenes' }).click();
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Nombre del almacen' })
      .fill('almacen' + uniqueId);
    await iframe.getByRole('textbox', { name: 'Sucursal' }).click();
    await iframe.getByLabel('0', { exact: true }).getByText('01').click();
    await iframe.getByRole('button', { name: 'Grabar' }).click();
    const cellLocator = iframe.getByRole('cell', { name: uniqueId, exact: true });
    await expect(cellLocator).toBeVisible();

    //await cellLocator.locator('button').nth(1).click();
    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await expect(iframe.getByRole('button', { name: 'Eliminar' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();

    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    await page.waitForTimeout(500);
    await expect(iframe.getByRole('cell', { name: uniqueId })).not.toBeVisible();

  });

  //Por ahora no es posible ya que no se pueden crear (si ya se alcanzo el limite) o borrar 
  test.skip('Sucursales: test 1', async () => {
    //TODO: Crear y borrar sucursales 
  });

});