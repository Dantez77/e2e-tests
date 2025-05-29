const { test, expect } = require('@playwright/test');
const credentials = require('@config/credentials.js');
const { login } = require('@helpers/login.js');

test.describe('Clientes', () => {
  let page;
  let context;
  let iframe;
  let uniqueId;
  let cliente;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframe = page.frameLocator('iframe');
    uniqueId = `CL-` + `${Date.now()}`.slice(-7);
    cliente = `Cliente ` + `${Date.now()}`.slice(-3);

    // Login and navigate to Modulo Ventas
    await test.step('Login and navigate to Modulo Ventas', async () => {
      await login(page, credentials);
      const ventasBtn = page.getByRole('link', { name: 'btn-moduloVentas' });
      await expect(ventasBtn).toBeVisible();
      await ventasBtn.click();
    });
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloVentas' }).click();
    await page.getByRole('link', { name: 'Clientes', exact: true }).click();
    iframe = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar cliente', async () => {
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Codigo cliente:' }).fill(uniqueId);
    await iframe.getByRole('textbox', { name: 'Razon social:' }).fill('RZ');
    await iframe.getByRole('textbox', { name: 'Nombre comercial:' }).fill(cliente);
    await iframe.locator('#direc').fill('direccion');
    await iframe.getByRole('textbox', { name: 'Giro' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Vendedor asignado' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Cod país (MH El Salvador)' }).click();
    await iframe.getByRole('textbox', { name: 'Type to filter' }).fill('el s');
    await iframe.getByText(': EL SALVADOR').click();
    await iframe.getByRole('textbox', { name: 'Email:' }).fill('mail@mail.com');
    await iframe.getByRole('textbox', { name: 'Telefono 1' }).fill('77776666');
    await iframe.getByRole('textbox', { name: 'Tipo de cliente:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    await iframe.getByRole('textbox', { name: 'Departamento:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();

    await iframe.getByText('Datos comerciales').click();
    await iframe.getByRole('textbox', { name: 'N.R.C.' }).fill('10000');

    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // Verificar que el cliente fue agregado
    await expect(iframe.locator('.mbsc-toast')).toHaveText('Un registro grabado');
  });

  test('Editar cliente', async () => {
    // Asegúrate que el cliente existe antes de editar
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
    await iframe.getByRole('textbox', { name: 'Telefono 1' }).fill('77776667');
    await iframe.getByRole('button', { name: 'Grabar' }).click();

    // Confirmar que se realizó la edición
    await expect(
      iframe.getByRole('row', { name: uniqueId }).getByRole('cell', { name: '77776667' })
    ).toBeVisible();
  });

  test('Eliminar cliente', async () => {
    // Asegúrate que el cliente existe antes de eliminar
    await iframe.getByRole('searchbox', { name: 'Buscar:' }).fill(uniqueId);
    await expect(iframe.getByRole('cell', { name: uniqueId })).toBeVisible();

    await iframe.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
    await iframe.getByRole('button', { name: 'Eliminar' }).click();
    await expect(iframe.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
    await iframe.getByRole('button', { name: 'Si - proceder' }).click();

    // Verificar que el cliente fue eliminado
    await expect(
      iframe.getByRole('row', { name: uniqueId })
    ).toHaveCount(0);
  });
});