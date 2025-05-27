const { test, expect } = require('@playwright/test');
const credentials = require('../../../config/credentials.js');
const { login } = require('../../helpers/login.js');

test.describe.serial('Numeración de documentos', () => {
  let page;
  let context;
  let iframe;
  const serie = 'SERIEPRUEBA';
  let nuevaSerie = '';

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');

    // Login
    await test.step('Login', async () => {
      await login(page, credentials);
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByText('Numeración de documentos').click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  // Se puden crear pero no se pueden eliminar. 
  // Dejar este test en skip por ahora hasta comprobar que posea funcionamiento adecuado
  test.fixme('Agregar Numeracion', async () => {
    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('button', { name: 'Agregar Numeración de' }).click();

    await iframe.getByRole('textbox', { name: 'Tipo de documento:' }).click();
    await iframe.getByRole('option', { name: 'Factura Sujeto Excluido FS' }).click();

    await iframe.getByRole('textbox', { name: 'Serie' }).fill(serie);
    await iframe.getByRole('spinbutton', { name: 'Ultimo numero registrado' }).fill('0');
    await iframe.getByRole('spinbutton', { name: 'Talonario/numeracion desde el' }).fill('1');
    await iframe.getByRole('spinbutton', { name: 'Talonario/numeracion hasta el' }).fill('1000');

    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test.fixme('Editar Numeracion', async () => {
    //EDITAR SERIE Y VERIFICAR
    nuevaSerie = 'SERIEEDITADA'

    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('cell', { name: serie }).click();
    await iframe.getByRole('textbox', { name: 'Serie' }).fill(nuevaSerie);

    await iframe.getByRole('button', { name: 'Grabar' }).click();

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro grabado');
  });

  test.fixme('Eliminar Numeracion', async () => {
    //EDITAR SERIE Y VERIFICAR
    await iframe.getByRole('textbox', { name: 'Sucursal:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByRole('row', { name: 'Factura Sujeto Excluido FS' })
      .getByRole('button').click(); //Boton delete

    // TODO: Terminar la funcionalidad de este test. 
    // Cuando se escribio este test, aun faltaba funcinabilidad 
    // Terminar una vez se comprueba que sirve
    await page.locator('iframe').contentFrame().getByText('Arrastre su archivo al área').click();
    
    // No correr los demas hasta que este funcione

    await expect(iframe.locator('.mbsc-toast')).toHaveText('Registro eliminado');
  });

});