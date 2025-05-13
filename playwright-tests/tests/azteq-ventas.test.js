const { test, expect } = require('@playwright/test');
const { crearCreditoFiscal } = require('../tests/helpers/crearCreditoFiscal');
const { crearNota } = require('../tests/helpers/crearNota');
const { crearFactura } = require('../tests/helpers/crearFactura');
const { crearCotizacion } = require('../tests/helpers/crearCotizacion');
const { busquedaDoc } = require('../tests/helpers/busquedaDoc');



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
    context.close();
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
  
  test.skip('Comprobante de donacion', async () => {
    //TODO: 
  });

  test.skip('Vendedores', async () => {
    //TODO: 
  });

  test.skip('Sucursales', async () => {
    //TODO:
  });

  test.skip('Grupos de clientes', async () => {
    //TODO: 
  });
});
