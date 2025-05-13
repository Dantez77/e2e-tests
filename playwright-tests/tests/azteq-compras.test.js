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