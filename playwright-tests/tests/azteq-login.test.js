const { test, expect } = require('@playwright/test');
const { todo } = require('node:test');


test.beforeAll(async () => {
  //console.log('Starting with login tests');
});

test.afterAll('Teardown', async () => {
  //console.log('Done with login tests');
});


test.describe('Login Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://azteq.club/azteq-club/login/');
  });

  //Page loads and shows all inputs
  test('Login: la pagina carga y se muestran todos los elementos', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#goLogin1')).toBeVisible();
  });

  test('Input correctos en login', async ({ page }) => {
    await page.fill('#username', 'test@test.com');
    await page.fill('#password', 'testpassword');
    await expect(page.locator('#username')).toHaveValue('test@test.com');
    await expect(page.locator('#password')).toHaveValue('testpassword');
  });

  test('Boton de login es abilitado una vez se llenan los campos', async ({ page }) => {
    await page.fill('#username', 'test@test.com');
    await page.fill('#password', 'testpassword');
    await expect(page.locator('#goLogin1')).toBeEnabled();
  });

  // Combinacion de usuario y contraseña con login exitoso 
  test('Combinacion de usuario y contraseña con login exitoso', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.click('#goLogin1');
    const welcomeText = await page.locator('#login2 .login-title').innerText();
    expect(welcomeText).toContain('BIENVENID@');
  });
  
  //Dropdowns available after login: Empresa & Sucursal
  test('Dropdowns visibles despues de hacer login', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.locator('#goLogin1').click();

    await expect(page.locator('#login2')).toBeVisible();

    const empresa = page.locator('#empresa');
    await expect(empresa).toBeVisible();
    await expect(empresa).toBeEnabled();

    const sucursal = page.locator('#cdsuc');
    await expect(sucursal).toBeVisible();
    await expect(sucursal).toBeEnabled();
  });

  //Keyboard login triggers login with "Enter"
  test('Se puede hacer login con "ENTER"', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.press('#password', 'Enter');
    const welcomeText = await page.locator('#login2 .login-title').innerText();
    expect(welcomeText).toContain('BIENVENID@');
  });

  //No error messages after login test
  test('Login correcto y sin errores', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.click('#goLogin1');
    await expect(page.locator('.error-message')).toHaveCount(0);
  });

  test.fixme('Login sin credenciales en los campos', async ({ page }) => {
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  test('Login sin password', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  test('Login con credenciales incorrectas', async ({ page }) => {
    await page.fill('#username', 'wronuser@wrong.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  // Test de fuerza bruta
  // Verificando si no se puede hacer intentos exesivos de login
  test('Brute force test: Infinite login attempts', async ({ page }) => {
    for (let i = 0; i < 6; i++) {
      await page.fill('#username', 'wronguser@wrong.com');
      await page.fill('#password', 'wrongpassword');
      await page.click('#goLogin1');
  
      await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
    }
    const isDisabled = await page.locator('#goLogin1').isDisabled();
    expect(isDisabled).toBe(true);
  });

  // Test de fuerza bruta. Este test NUNCA deberia tener éxito si las protecciones están en su lugar.
  // Solo correr en test.only
  test.skip('Brute force bot: should not allow login', async ({ page }) => {
    // Current password is 1234
    let pass = 1200;
    let loginSuccess = false;

    for (let i = 0; i < 40; i++) {
      pass += 1;
      await page.fill('#username', 'danq97@gmail.com');
      await page.fill('#password', pass.toString());
      await page.click('#goLogin1');

      // Wait briefly in case of rate limiting or delayed response
      await page.waitForTimeout(200);

      const isVisible = await page.locator('#login2').isVisible();
      if (isVisible) {
        const welcomeText = await page.locator('#login2 .login-title').innerText();
        if (welcomeText.includes('BIENVENID@')) {
          console.warn(`Login successful on attempt: ${pass}. This indicates a security issue.`);
          loginSuccess = true;
          break;
        }
      }
    }
    // Si funciono el login, entonces el test falla
    expect(loginSuccess).toBeFalsy();
  });

  
  test('Failed login prevents redirect', async ({ page }) => {
    await page.fill('#username', 'wronguser@wrong.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#goLogin1');
    await expect(page).toHaveURL('https://azteq.club/azteq-club/login/');
  });

  test('Recover password: Empty form ', async ({ page }) => {
    await page.click('#recupera_pwd');
    await page.fill('#correo_usr', '');
    await page.click('#recuperar');

    await expect(page.locator('.mbsc-toast')).toHaveText('Ingrese su correo');
  });

  test('Recover password: Non registered email ', async ({ page }) => {
    await page.click('#recupera_pwd');
    await page.fill('#correo_usr', 'test');
    await page.click('#recuperar');

    await expect(page.locator('.mbsc-toast')).toHaveText('[ERROR] El correo no está registrado');

  });

  test('Recover password: With registered email ', async ({ page }) => {
    await page.click('#recupera_pwd');
    await page.fill('#correo_usr', 'danq97@gmail.com');
    await page.click('#recuperar');

    await expect(page.locator('.mbsc-toast')).toHaveText('Correo enviado!');
  });
  

  test('Complete login flow ', async ({ page }) => {  
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.locator('#goLogin1').click();
  
    await expect(page.locator('#login2')).toBeVisible();
  
    const empresa = page.locator('#empresa');
    await expect(empresa).toBeEnabled();
  
    const sucursal = page.locator('#cdsuc');

    await sucursal.click();

    const exactOption = page.getByRole('option', { name: 'Oficina central', exact: true });

    await expect(exactOption).toBeVisible({ timeout: 5000 });

    await exactOption.click();

    await page.locator('#goLogin2').click();
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/menu.php');
  });

  //Verificando que PHPSESSID esta puesta y persiste atreves de requests nos asegura que los usuarios fueron autenticados
  test('Validate auth cookies after login', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.locator('#goLogin1').click();
  
    await expect(page.locator('#login2')).toBeVisible();
  
    const empresa = page.locator('#empresa');
    await expect(empresa).toBeEnabled();
  
    const sucursal = page.locator('#cdsuc');

    await sucursal.click();

    const exactOption = page.getByRole('option', { name: 'Oficina central', exact: true });

    await expect(exactOption).toBeVisible({ timeout: 5000 });

    await exactOption.click();

    await page.locator('#goLogin2').click();
    await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
    await expect(page.url()).toContain('/menu/menu.php');
  
    const cookies = await page.context().cookies();
  
    const sessionCookie = cookies.find(cookie => cookie.name === 'PHPSESSID');
  
    expect(sessionCookie).toBeDefined();  
    expect(sessionCookie.value).not.toBe(''); 
  
    const expiryDate = sessionCookie.expires;
    const currentTime = Date.now() / 1000;  
    expect(expiryDate).toBeGreaterThan(currentTime);  // Fecha de expiracion 
  });
  
});