const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('/home/qa/repo/e2e-tests/playwright-tests/tests/helpers/crearCreditoFiscal');

test.describe('Modulo Ventas', () => {
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

      const comprasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(comprasBtn).toBeVisible();
      await comprasBtn.click();
    });
  });

  //to get into the module fresh each time before a test
  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Se muestran todos los elementos y opciones en patalla', async () => {

    expect(page.getByRole('link', { name: 'Ventas', exact: true }));
    await expect(page.getByRole('link', { name: 'Crédito fiscal' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Factura', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Factura de exportación' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nota de crédito' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nota de débito' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cotización' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Comprobante de donación' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Vendedores' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Clientes', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Productos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sucursales' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Grupos de clientes' })).toBeVisible();

    //Configuraciones
    await expect(page.getByRole('button', { name: 'Informes y consultas' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cuadros de mando gerencial' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Configuración' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Facturación electrónica' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cobros y facturación automá' })).toBeVisible();
  });

  test('snapshot test', async () => {
    await expect(page.locator('#bTabs_menuid1')).toMatchAriaSnapshot(`
          - link "Crédito fiscal"
          - link "Factura"
          - link "Factura de exportación"
          - link "Nota de crédito"
          - link "Nota de débito"
          - link "Cotización"
          - link "Comprobante de donación"
          - separator
          - link "Vendedores"
          - link "Clientes"
          - link "Productos"
          - link "Sucursales"
          - link "Grupos de clientes"
          - button "Informes y consultas":
            - img
            - img
          - button "Cuadros de mando gerencial":
            - img
            - img
          - button "Configuración":
            - img
            - img
          - button "Facturación electrónica":
            - img
            - img
          - button "Cobros y facturación automática":
            - img
            - img
          `);
  });

  test('Credito fiscal: Agregar, Editar y Anular', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Credito Fiscal, esto incluye:
    // - Crear un documento de facturacion (indice de exito: Verificacion de documento creado) - INCOMPLETO (VERIFICAR CON ALERTA)
    // - Editar un documento de facturacion (indice de exito: Verificacion de documento editado) - COMPLETO
    // - Anular un documento de facturacion (indice de exito: Verificacion de que el documento fue anulado) - COMPLETO
    // - Obtener cotizacion -PENDIENTE <============

    const iframeElement = page.frameLocator('iframe');
    let documentValue = '';
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();

    await test.step('Grabando un nuevo documento', async () => {
      //TODO: Por ahora falta verificar el toast despues de crear documento 
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
      //console.log('Documento generado:', documentValue);

      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      await iframeElement.getByRole('textbox', { name: 'Código' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('10');

      await iframeElement.locator('#btnConfirmAddLine').click();

      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();
    });

    await test.step('Buscar y editar documento', async () => {
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();

      await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
      iframeElement.getByRole('cell', { name: documentValue }).click();
      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      //El elemento aqui se llama Bob, pero sera diferente en caso cambien las credenciales actualmente utilizadas
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('button', { name: 'Grabar cambios' }).click();

      //Se busca otra vez
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();

      //Verificar que el documento fue editado
      await expect(iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'Bob' })).toBeVisible();
    });

    //Anular documento recien creado
    await test.step('Anular documento', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
      await iframeElement.getByRole('button', { name: 'Anular Documento' }).click();
      await iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'Bob' }).click();

      await iframeElement.locator('#btnConfirmNull').click();


      await page.waitForTimeout(500);

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500)

      //Confirmar que fue anulado
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await expect(iframeElement
        .getByRole('row', { name: documentValue })
        .getByRole('cell', { name: 'Bob' })).toHaveCount(0);
    });
  });

  test('Factura', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Facturacion, esto incluye:
    // - Crear un documento de facturacion (indice de exito: Verificacion de documento creado) - INCOMPLETO FALTA VERIFICACION
    // - Editar un documento de facturacion (indice de exito: Verificacion de documento editado) - COMPLETO
    // - Anular un documento de facturacion (indice de exito: Verificacion de que el documento fue anulado) - COMPLETO
    // - Obtener cotizacion -PENDIENTE <============

    const iframeElement = page.frameLocator('iframe');
    let documentValue = ''; //Facturas posee un id auto generado, usamos esta variable para extraerlo y verificacion
    await page.getByRole('link', { name: 'Factura', exact: true }).click();

    await test.step('Grabando un nuevo documento', async () => {
      //TODO: Por ahora falta verificar el toast despues de crear documento 
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      await iframeElement.getByRole('textbox', { name: 'Términos de pago' }).click();
      await iframeElement.locator('[role="option"][data-index="1"]').click();

      documentValue = await iframeElement.locator('input#coddoc').inputValue();

      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      await iframeElement.getByRole('textbox', { name: 'Código' }).click();
      await iframeElement.locator('[role="option"][data-index="4"]').click();
      await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('12');

      await iframeElement.locator('#btnConfirmAddLine').click();

      await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();
    });

    await test.step('Editando el documento creado', async () => {
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click(); //Buscar por numero de doc

      await expect(iframeElement.getByRole('cell', { name: documentValue })).toBeVisible();
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

  test('Factura de exportacion: Crear, Editar y Anular', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Factura de exportacion, esto incluye:
    // - Crear un documento de facturacion (indice de exito: Verificacion de documento creado) - COMPLETO
    // - Editar un documento de facturacion (indice de exito: Verificacion de documento editado) - COMPLETO
    // - Anular un documento de facturacion (indice de exito: Verificacion de que el documento fue anulado) - PENDIENTE
    // - Obtener cotizacion -PENDIENTE

    const iframeElement = page.frameLocator('iframe');
    let documentValue = '';
    await page.getByRole('link', { name: 'Factura de exportación', exact: true }).click();


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

  test('Nota de credito', async () => {
    // TODO: Añadir las funcionalidades posibles dentro de Factura de exportacion, esto incluye:
    // - Crear un documento (indice de exito: Verificacion de documento creado) - COMPLETO
    // - Editar un documento (indice de exito: Verificacion de documento editado) - PENDIENTE
    // - Anular un documento (indice de exito: Verificacion de que el documento fue anulado) - PENDIENTE
    // REQUIERE PARA FUNCIONAR: Creacion previa de credito fiscal. - COMPLETADO POR MEDIO DE FUNCION AYUDA

    const iframeElement = page.frameLocator('iframe');
    let numeroCFF = '';
    let documentValue = '';

    numeroCFF = await crearCreditoFiscal(page, iframeElement);

    await page.getByRole('link', { name: 'Ventas' }).click();
    await page.getByRole('link', { name: 'Crédito fiscal Close' }).getByLabel('Close').click();

    await test.step('Creando Nota de Credito', async () => {
      await page.getByRole('link', { name: 'Nota de crédito', exact: true }).click();
      await page.waitForTimeout(500);
      documentValue = await iframeElement.locator('input#coddoc').inputValue();

      await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click(); //Cliente
      await iframeElement.locator('[role="option"][data-index="2"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click(); //Vendedor
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Crédito fiscal' }).click(); // Credito Fiscal
      await iframeElement.getByRole('option', { name: numeroCFF }).click();

      await iframeElement.getByRole('button', { name: 'Grabar Documento' }).click();

      //Confirmando que el documento fue creado
      await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
      await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
      await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

      await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();

      expect(iframeElement.getByRole('row', { name: documentValue })).toBeVisible();
    });

  });

  test.skip('Nota de debito', async () => {
    //TODO: 
  });

  test.skip('Cotizacion', async () => {
    //TODO: 
  });

  test.skip('Comprobante de donacion', async () => {
    //TODO: 
  });

  test.skip('Vendedores', async () => {
    //TODO: 
  });

  //Creado, Editado y borrado de cliente
  test('Clientes: Agregar, Editar y Eliminar', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `CL-` + `${Date.now()}`.slice(-7);
    const cliente = `Cliente ` + `${Date.now()}`.slice(-3);

    await page.getByRole('link', { name: 'Clientes', exact: true }).click();

    // Creando cliente
    await test.step('Agregando Producto a la tabla', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      //Llenando formulario
      await iframeElement.getByRole('textbox', { name: 'Codigo cliente:' }).fill(uniqueId);
      await iframeElement.getByRole('textbox', { name: 'Razon social:' }).fill('RZ');
      await iframeElement.getByRole('textbox', { name: 'Nombre comercial:' }).fill(cliente);
      await iframeElement.locator('#direc').fill('direccion');
      await iframeElement.getByRole('textbox', { name: 'Giro' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor asignado' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Cod país (MH El Salvador)' }).click();
      await iframeElement.getByRole('textbox', { name: 'Type to filter' }).fill('el s');
      await iframeElement.getByText(': EL SALVADOR').click();

      await iframeElement.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
      await iframeElement.getByRole('textbox', { name: 'Telefono 1' }).fill('77776666');

      await iframeElement.getByRole('textbox', { name: 'Tipo de cliente:' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Departamento:' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      //Verificando que el elemento fue agregado a la tabla y es visible
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();

    });

    //Editando formulario
    await test.step('Editando el producto de la tabla', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
      await iframeElement.getByRole('textbox', { name: 'Telefono 1' }).fill('77776667');
      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      //Confirmar que se realizo la edicion
      await expect(iframeElement
        .getByRole('row', { name: uniqueId })
        .getByRole('cell', { name: '77776667' })).toBeVisible();
    });

    //Eliminando cliente
    await test.step('Eliminando el producto de la tabla', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();

      await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
      await page.waitForTimeout(500);

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500);


      await expect(iframeElement
        .getByRole('row', { name: uniqueId }))
        .toHaveCount(0);
    });

  });

  //Creado, Editado y borrado de productos
  test('Productos: Agregar, Editar y Eliminar', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `P-` + `${Date.now()}`.slice(-7);
    const producto = `Producto ` + `${Date.now()}`.slice(-4);

    await page.getByRole('link', { name: 'Productos', exact: true }).click();

    //Creando producto
    await test.step('Agregando el producto a la tabla', async () => {

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

    //Editando producto
    await test.step('Editando el item en la tabla', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').first().click();

      await iframeElement.getByText('Precios').click();
      await iframeElement.getByRole('spinbutton', { name: 'Precio 1 CON IVA' }).fill('50');

      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      //Confirmar que se realizo la edicion
      await expect(iframeElement
        .getByRole('row', { name: uniqueId })
        .getByRole('cell', { name: '50' })).toBeVisible();
    });

    //Eliminando producto
    await test.step('Eliminando item de la tabla', async () => {
      await page.locator('iframe').contentFrame().getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
      await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
      await page.waitForTimeout(500);

      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();
      await page.waitForTimeout(500);

      //Asegurandonos que el item ya no existe
      await expect(iframeElement
        .getByRole('row', { name: uniqueId }))
        .toHaveCount(0);
    });

  });

  test.skip('Sucursales', async () => {
    //TODO: 
  });

  test.skip('Grupos de clientes', async () => {
    //TODO: 
  });

  ////////////////////////////////////////////////////////
  //           Configuraciones adicionales              //
  ////////////////////////////////////////////////////////

  //Esta test fue creado solo para automatizar la creacion de nuevos clientes, dejar en skip o borrar en el futuro
  test.skip('Clientes Exterior: Nuevo cliente', async () => {
    const iframeElement = page.frameLocator('iframe');
    const uniqueId = `CEXT-` + `${Date.now()}`.slice(-5);
    const cliente = `Cliente Exterior ` + `${Date.now()}`.slice(-3);

    await page.getByRole('link', { name: 'Clientes', exact: true }).click();

    // Creando cliente
    await test.step('Agregando Producto a la tabla', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();

      //Llenando formulario
      await iframeElement.getByRole('textbox', { name: 'Codigo cliente:' }).fill(uniqueId);
      await iframeElement.getByRole('textbox', { name: 'Razon social:' }).fill('RZ');
      await iframeElement.getByRole('textbox', { name: 'Nombre comercial:' }).fill(cliente);
      await iframeElement.locator('#direc').fill('direccion ');
      await iframeElement.getByRole('textbox', { name: 'Giro' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Vendedor asignado' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Ubicación' }).click();
      await iframeElement.locator('[role="option"][data-index="2"]').click();

      await iframeElement.getByRole('textbox', { name: 'Cod país (MH El Salvador)' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
      await iframeElement.getByRole('textbox', { name: 'Telefono 1' }).fill('6377776666');

      await iframeElement.getByRole('textbox', { name: 'Tipo de cliente:' }).click();
      await iframeElement.locator('[role="option"][data-index="0"]').click();

      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      //Verificando que el elemento fue agregado a la tabla y es visible
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();

    });
  });


});