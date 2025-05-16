const { test, expect } = require('@playwright/test');
const credentials = require('../config/credentials.js');
const { login } = require('./helpers/login.js'); // Ajusta la ruta si es necesario

test.describe('Modules Page Functionality', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // login flow usando helper y credenciales
    await login(page, credentials);
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    expect(page.url()).toContain('/menu/menu.php');
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('La pagina carga correctamente', async () => {
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/menu.php');
  });

  test('Toggle de tema oscuro y claro', async () => {
    const theme = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(theme).toBe('dark');

    await page.click('.slider-dark-bg');

    const themeAfterToggle = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(themeAfterToggle).toBe('light');

    await page.click('span.slider.round.slider-light-bg');

    const themeAfterSecondToggle = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(themeAfterSecondToggle).toBe('dark');

  });

  test('Configuraciones se muestran correctamente', async () => {
    await page.click("[id='btnConfig']");

    //menu
    await expect(page.locator("[id='updaterepos']")).toBeVisible(); //Actualizar repos
    await expect(page.locator("[id='updatedic']")).toBeVisible(); //actualizar diccionario
    await expect(page.locator("[id='cfgreturn2menu']")).toBeVisible(); //Regresar al menu principal

    await page.click("[id='cfgreturn2menu']");
    await expect(page.locator("[id='updaterepos']")).not.toBeVisible();
  });

  test('Boton de cuenta muestra el menu correctamente', async () => {
    await page.click("[id='btnAccount']");

    await expect(page.locator("[id='changepassword']")).toBeVisible(); //Actualizar password
    await expect(page.locator("[id='configureaccount']")).toBeVisible(); //Configurar cuenta
    await expect(page.locator("[id='admsubscrip']")).toBeVisible(); //Administrar Subscripcion
    await expect(page.locator("[id='changecompany']")).toBeVisible(); //Cambiar empresa
    await expect(page.locator("[id='return2menu']")).toBeVisible(); //Regresar al Menu principal
    await expect(page.locator("[id='logout']")).toBeVisible(); //Log out

    await page.click("[id='return2menu']");
    await expect(page.locator("[id='changepassword']")).not.toBeVisible();
  });

  // Que no se corra me dijeron, pero aqui esta por si acaso
  test.fixme('Actualizar repositorios estandar: Checks POST validation', async () => {
    await page.click("[id='btnConfig']");
    //await page.screenshot({ path: 'test1.png', fullPage: true }); //Debug screenshot
    await page.click("[id='updaterepos']");

    const [request] = await Promise.all([
      page.waitForRequest(request =>
        request.url().includes('twsync/twactual.php') && request.method() === 'POST'
      ),
      page.click('#updaterepos'),
    ]);

    const postData = request.postDataJSON();
    expect(postData).toEqual({ toalert: true });
  });

  test('Logout desde opciones de usuario', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='logout']");

    // Check if the logout pop up shows up after clicking logout
    await expect(page.getByText('Logout')).toBeVisible();
    await expect(page.getByText('Desea terminar sesión?')).toBeVisible();

    await expect(page.getByRole('button', { name: 'No - Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Si - proceder' })).toBeVisible();

    // Log out
    await page.getByRole('button', { name: 'Si - proceder' }).click();

    // Back to log in menu
    await page.waitForURL('**/login/index.php', { timeout: 10000 });
    expect(page.url()).toContain('/login/index.php');

    // Check if the session really closed
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  test.skip('Actualizar repositorios estandar: Checks for success mesage', async () => {
    await page.click("[id='btnConfig']");
    await page.click("[id='updaterepos']");

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Proceso concluido');
    });
  });

  //Que no se corra me dijeron, pero aqui esta por si acaso
  test.skip('Actualizar diccionario: Checks for success messafe', async () => {
    await page.click("[id='btnConfig']");
    await page.click("[id='updatedic']");

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Proceso concluido');
    });
  });


  test('Cambio de contraseña: Se requieren todos los inputs', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    //Checking every field is there
    expect(page.locator("#u_nombres")).toBeVisible();
    expect(page.locator("#u_apellidos")).toBeVisible();
    expect(page.locator("#pwd_actual")).toBeVisible();
    expect(page.locator("#pwd_new1")).toBeVisible();
    expect(page.locator("#pwd_actual")).toBeVisible();

    //Checking they have the attribute [required] for so field is nto allowed to remain empty
    await page.fill("#pwd_actual", "");
    await page.fill("#pwd_new1", "");
    await page.fill("#pwd_new2", "");


    page.getByRole('button', { name: 'Cambiar clave' }).click();

    await expect(page.locator('.mbsc-toast')).toHaveText('Completa todos los campos');
  });

  //Password change (For now it allows a password change to the same or previously used passwords)
  test('Cambio de contraseña: Se efectua el cambio efectivamente', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual", credentials.password);
    await page.fill("#pwd_new1", credentials.password);
    await page.fill("#pwd_new2", credentials.password);

    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('OK');
        await dialog.accept();
      }),
      page.getByRole('button', { name: 'Cambiar clave' }).click(),
    ]);
  });

  //Attempt to change password without having the correct password first
  test('Cambio de contraseña: Verifica que el password actual sea el correcto', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual", "wrongpassword");
    await page.fill("#pwd_new1", "newpassword");
    await page.fill("#pwd_new2", "newpassword");

    await Promise.all([
      page.waitForEvent('dialog').then(async (dialog) => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('ERROR: Incorrect user or password');
        await dialog.accept();
      }),
      page.getByRole('button', { name: 'Cambiar clave' }).click(),
    ]);
  });

  test('Cambio de contraseña: Verifica si todos los campos poseen input valido', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual", "wrongpassword");
    await page.fill("#pwd_new1", "");
    await page.fill("#pwd_new2", "");


    page.getByRole('button', { name: 'Cambiar clave' }).click();

    await expect(page.locator('.mbsc-toast')).toHaveText('Completa todos los campos');
  });

  // For future reference this test will fail if account doesnt have a branch named 'Oficina central Norte'
  // Opciones por defecto para el usuario
  test('Configurar Cuenta: Cambiar sucursal', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='configureaccount']");

    //Changing branch
    await page.click('[placeholder="Sucursal"]');
    await page.click('text="Oficina central norte"');

    //Changing back to avoid issues
    await page.click('[placeholder="Sucursal"]');
    await page.click('text="Oficina central"');

    //Checking it saves new configuration
    await page.click("[id='dosetdefaults']");

    await expect(page.locator('.mbsc-toast')).toHaveText('Opciones por defecto han sido guardadas');
  });

  //Billing page loads correctly
  test.fixme('Manejo de subscripcion carga correctamente', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='admsubscrip']");

    //Loads new tab and checks for important elements 
    const pagePromise = page.waitForEvent('popup');
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    await expect(newTab).toHaveURL(/https:\/\/billing\.stripe\.com\/.*/);
    await expect(newTab.locator('[data-test="update-subscription"]')).toBeVisible();
    await expect(newTab.locator('[data-test="cancel-subscription"]')).toBeVisible();
    await expect(newTab.getByRole('link', { name: 'Añadir método de pago' })).toBeVisible();

    //Pagina de factura
    await page.waitForTimeout(500);
    const page2Promise = newTab.waitForEvent('popup');
    await newTab.getByTestId('hip-link').click();

    const page2 = await page2Promise;
    await expect(page2.getByText('Número de factura')).toBeVisible();
    await expect(page2.getByText('Fecha de pago')).toBeVisible();
    await expect(page2.getByTestId('download-invoice-receipt-pdf-button')).toBeVisible();
    await expect(page2.getByRole('button', { name: 'Descargar factura' })).toBeVisible();
  });

  //Opciones de Usuario: Cambiar Sucursal
  test('Cambio de empresa', async () => {
    // Open account menu and change company
    await page.click("[id='btnAccount']");
    await page.click("[id='changecompany']");

    await page.waitForURL('**/menu/cambiar_empresa.php', { timeout: 10000 });
    expect(page.url()).toContain('/menu/cambiar_empresa.php');

    // Select enterprise
    await page.click('[id="dbschm_dummy"]');
    await page.click('[role="option"][data-index="0"]');

    // Select branch
    await page.click('[id="cdsuc_dummy"]');
    const selectedCdsuc = await page.locator('[role="option"][data-index="0"] div[style="font-size:16px;line-height:18px;"]').innerText();
    await page.click('[role="option"][data-index="0"]');

    // Confirm changes 
    await page.click('[id="cambiarEmpresa"]');

    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    expect(page.url()).toContain('/menu/menu.php');

    // Get branch name from main menu
    const fullLabel = await page.locator('.b4-sucurs-name.pl-2').innerText();

    // Validate branch once we are again in the mian menu
    expect(fullLabel).toContain(selectedCdsuc);
  });
});