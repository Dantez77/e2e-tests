const { test, expect } = require('@playwright/test');

test.describe('Modules Page Functionality', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    // context and page before all tests
    context = await browser.newContext(); 
    page = await context.newPage(); 

    // login flow
    await page.goto('https://azteq.club/azteq-club/login/');
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.locator('#goLogin1').click();

    await expect(page.locator('#login2')).toBeVisible();

    const sucursal = page.locator('#cdsuc');
    await sucursal.click();

    const exactOption = page.getByRole('option', { name: 'Oficina central', exact: true });
    await exactOption.click();

    await page.locator('#goLogin2').click();
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/menu.php');
  });

  test.afterAll(async () => {
    await page.close(); 
    await context.close(); 
  });

  test('Page loads correctly', async () => {
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/menu.php');
  });

  test('Toggle and load theme', async () => {

    const theme = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(theme).toBe('dark');

    await page.click('.slider-dark-bg'); 

    const themeAfterToggle = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(themeAfterToggle).toBe('light');
    //await page.screenshot({ path: 'test2.png', fullPage: true }); //Debug screenshot

    await page.click('span.slider.round.slider-light-bg'); 

    const themeAfterSecondToggle = await page.evaluate(() => {
      return localStorage.getItem('azteqTheme');
    });
    expect(themeAfterSecondToggle).toBe('dark');
    //await page.screenshot({ path: 'test1.png', fullPage: true }); //Debug screenshot

  });

  test('Configuration btn event', async () => {
    await page.click("[id='btnConfig']");
    //await page.screenshot({ path: 'test1.png', fullPage: true }); //Debug screenshot

    //menu
    await expect(page.locator("[id='updaterepos']")).toBeVisible(); //Actualizar repos
    await expect(page.locator("[id='updatedic']")).toBeVisible(); //actualizar diccionario
    await expect(page.locator("[id='cfgreturn2menu']")).toBeVisible(); //Regresar al menu principal

    await page.click("[id='cfgreturn2menu']");
    await expect(page.locator("[id='updaterepos']")).not.toBeVisible();
  });

  test('Account btn event', async () => {
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

  //TODO: Fix it so it actually tests POST validation and just the success toast
  test.skip('Actualizar repositorios estandar: Checks POST validation', async () => {
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

  //Logout desde opciones de usuario
  test('Logout from user options', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='logout']");

    //Check if the logout pop up shows up after clicking logout
    await expect(page.getByText('Logout')).toBeVisible();
    await expect(page.getByText('Desea terminar sesión?')).toBeVisible();
    
    await expect(page.getByRole('button', { name: 'No - Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Si - proceder' })).toBeVisible();

    //Log out
    await page.getByRole('button', { name: 'Si - proceder' }).click();

    //Back to log in menu
    await page.waitForURL('**/login/index.php', { timeout: 10000 });
    await expect(page.url()).toContain('/login/index.php');
    
    //Check if the session really closed
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


  test('Change password: Required input test', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    //Checking every field is there
    expect(page.locator("#u_nombres")).toBeVisible(); 
    expect(page.locator("#u_apellidos")).toBeVisible(); 
    expect(page.locator("#pwd_actual")).toBeVisible(); 
    expect(page.locator("#pwd_new1")).toBeVisible(); 
    expect(page.locator("#pwd_actual")).toBeVisible(); 

    //Checking they have the attribute [required] for so field is nto allowed to remain empty
    const pwdActualReq = await page.locator("#pwd_actual").getAttribute("required");
    expect(pwdActualReq).not.toBeNull();
    const NewPwdReq = await page.locator("#pwd_actual").getAttribute("required");
    expect(NewPwdReq).not.toBeNull();
    const New2PwdReq = await page.locator("#pwd_actual").getAttribute("required");
    expect(New2PwdReq).not.toBeNull();
  });

  //Password change (For now it allows a password change to the same or previously used passwords)
  test('Change password: Correct password change', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual","1234");
    await page.click("#pwd_actual","1234");
    await page.click("#pwd_actual","1234");

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('OK');
    });
  });

  //Attempt to change password without having the correct password first
  test('Change password: Attempt with wrong password', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual","wrongpassword");
    await page.click("#pwd_actual","test");
    await page.click("#pwd_actual","test");

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('ERROR: Incorrect user or password');
    });
  });

  //Checking if password field can be left empty and password can be changed to ''
  test.skip('Change password: Check if password cant be changed to "" ', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='changepassword']");

    await page.fill("#pwd_actual","1234");
    await page.click("#pwd_actual","");
    await page.click("#pwd_actual","");

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Error al digitar palabra clave. Verifique');
    });
  });

  // For future reference this test will fail if account doesnt have a branch named 'Oficina central Norte'
  // Opciones por defecto para el usuario
  test('User default options: Changing branch', async () => {
    await page.click("[id='btnAccount']");
    await page.click("[id='configureaccount']");

    //Changing branch
    await page.click('[placeholder="Sucursal"]'); 
    await page.click('text="Oficina central norte"');
    //await page.screenshot({ path: 'test.png', fullPage: true }); //Debug screenshot

    //Changing back to avoid issues
    await page.click('[placeholder="Sucursal"]'); 
    await page.click('text="Oficina central"');
    //await page.screenshot({ path: 'test2.png', fullPage: true }); //Debug screenshot

    //Checking it saves new configuration
    await page.click("[id='dosetdefaults']");

    await expect(page.locator('.mbsc-toast')).toHaveText('Opciones por defecto han sido guardadas');
    //await page.screenshot({ path: 'test1.png', fullPage: true }); //Debug screenshot
  });

  //Billing page loads correctly
  test.fixme('Subscription management: Billing page loads correctly', async () => {
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
  test('Changing Company and Branch', async () => {
    // Open account menu and change company
    await page.click("[id='btnAccount']");
    await page.click("[id='changecompany']");
  
    await page.waitForURL('**/menu/cambiar_empresa.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/cambiar_empresa.php');
  
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
    await expect(page.url()).toContain('/menu/menu.php');
  
    // Get branch name from main menu
    const fullLabel = await page.locator('.b4-sucurs-name.pl-2').innerText();

    // Validate branch once we are again in the mian menu
    expect(fullLabel).toContain(selectedCdsuc);
  });
});


