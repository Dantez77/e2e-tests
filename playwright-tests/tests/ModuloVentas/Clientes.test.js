const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Clientes', () => {
  let page;
  let context;
  let iframeElement;
  let uniqueId;
  let cliente;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    iframeElement = page.frameLocator('iframe');
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
    iframeElement = page.frameLocator('iframe');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Agregar, Editar y Eliminar Cliente', async () => {
    // Agregar cliente
    await test.step('Agregar cliente', async () => {
      await iframeElement.getByRole('button', { name: 'Agregar' }).click();
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

      // Verificar que el cliente fue agregado
      await expect(iframeElement.getByRole('cell', { name: uniqueId })).toBeVisible();
    });

    // Editar cliente
    await test.step('Editar cliente', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').first().click();
      await iframeElement.getByRole('textbox', { name: 'Telefono 1' }).fill('77776667');
      await iframeElement.getByRole('button', { name: 'Grabar' }).click();

      // Confirmar que se realizó la edición
      await expect(
        iframeElement.getByRole('row', { name: uniqueId }).getByRole('cell', { name: '77776667' })
      ).toBeVisible();
    });

    // Eliminar cliente
    await test.step('Eliminar cliente', async () => {
      await iframeElement.getByRole('row', { name: uniqueId }).getByRole('button').nth(1).click();
      await iframeElement.getByRole('button', { name: 'Eliminar' }).click();
      await expect(iframeElement.getByRole('button', { name: 'Si - proceder' })).toBeVisible();
      await iframeElement.getByRole('button', { name: 'Si - proceder' }).click();

      // Verificar que el cliente fue eliminado
      await expect(
        iframeElement.getByRole('row', { name: uniqueId })
      ).toHaveCount(0);
    });
  });
});