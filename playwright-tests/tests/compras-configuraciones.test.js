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

    /*
  ======== Configuracion e informes del modulo compras ==========
  ********Hacer otra suite aparte para esto mas tarde
  */


  //Informes y consultas
  test.skip('Informes y consultas: Libro de Compras', async () => {
    //TODO: 
  });

  test.skip('Informes y consultas: Compras por producto', async () => {
    //TODO:
  });

  test.skip('Informes y consultas: Compras por proveedor', async () => {
    //TODO:
  });

  test.skip('Informes y consultas: Compras por fecha', async () => {
    //TODO: 
  });

  test.skip('Informes y consultas: Retaceo de poliza de importancion', async () => {
    //TODO:
  });

  test.skip('Informes y consultas: Compras por sucursal', async () => {
    //TODO:
  });

  test.skip('Informes y consultas: Retenciones IVA', async () => {
    //TODO:
  });

  test.skip('Informes y consultas: Exportacion Archivos .csv', async () => {
    //TODO:
  });


  //Configuracion

  test.skip('Configuracion: Periodo de trabajo', async () => {
    //TODO: Agregar funcionalidades cuando se tenga acceso
  });

  test.skip('Configuracion: Conceptos de gastos', async () => {
    await page.getByRole('button', { name: 'Configuración' }).click();
    await page.getByText('Conceptos de gastos').click();

    //TODO: Debido a que no se pueden borrar elementos aqui, no se continuara haciendo tests aqui
  });

  test.skip('Configuracion: Datos de la empresa', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Compras con numero provisional', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Numeracion de documentos', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Logo de la emrpresa', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Transferencias con numero provisional', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Compradores', async () => {
    //TODO: 
  });

  test.skip('Configuracion: Generar CSE de nomina honorarios', async () => {
    //TODO: 
  });


  //Facturacion electronica
  test.skip('Facturacion electronica: Revision / envio de DTEs', async () => {
    //TODO: 
  });

  test.skip('Facturacion electronica: Consulta / Re-envio de DTEs', async () => {
    //TODO: 
  });

});