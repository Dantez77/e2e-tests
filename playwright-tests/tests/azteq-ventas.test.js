const { test, expect } = require('@playwright/test');

/*
  Recordar cambiar correo y usuario antes de que se me acabe el plan de prueba o____o. 
*/

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

  test.skip('Credito fiscal', async () => {
    const iframeElement = page.frameLocator('iframe');
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
    //TODO: Implementar funcionalidad

  });

  test.skip('Factura', async () => {
    //TODO: 
  });

  test.skip('Factura de exportacion', async () => {
    //TODO: 
  });

  test.skip('Nota de credito', async () => {
    //TODO: 
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
  test('Clientes: : Agregar, Editar y Eliminar', async () => {
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
});