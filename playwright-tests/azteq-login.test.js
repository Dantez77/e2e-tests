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
  test('Page loads and shows all inputs', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#goLogin1')).toBeVisible();
  });

  //User can enter email and password
  test('User can enter email and password', async ({ page }) => {
    await page.fill('#username', 'test@test.com');
    await page.fill('#password', 'testpassword');
    await expect(page.locator('#username')).toHaveValue('test@test.com');
    await expect(page.locator('#password')).toHaveValue('testpassword');
  });

  //Login button enabled with filled form
  test('Login button enabled with filled form', async ({ page }) => {
    await page.fill('#username', 'test@test.com');
    await page.fill('#password', 'testpassword');
    await expect(page.locator('#goLogin1')).toBeEnabled();
  });

  //Valid username and password combination successfully logs the user in.
  test('Valid username and password combination successfully logs the user in.', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.click('#goLogin1');
    const welcomeText = await page.locator('#login2 .login-title').innerText();
    expect(welcomeText).toContain('BIENVENID@');
  });
  
  //Dropdowns available after login: Empresa & Sucursal
  test('Dropdowns available after login: Empresa & Sucursal', async ({ page }) => {
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
  test('Keyboard login triggers login with "Enter"', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.press('#password', 'Enter');
    const welcomeText = await page.locator('#login2 .login-title').innerText();
    expect(welcomeText).toContain('BIENVENID@');
  });

  //No error messages after login test
  test('No error messages after successful login', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.click('#goLogin1');
    await expect(page.locator('.error-message')).toHaveCount(0);
  });

  //Check this test again later as I dont know rn how to test correct cookie validation
  test.skip('Session or cookie validation after login', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.fill('#password', '1234');
    await page.click('#goLogin1');
    //TODO: cookie validation
  });

  test('Submit empty form', async ({ page }) => {
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');

    //await expect(page.locator('.error-message')).toBeVisible();  
  });

  //Submit form with only email: Should show error or a alarm toast
  test('Submit form with only email', async ({ page }) => {
    await page.fill('#username', 'danq97@gmail.com');
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  test('Incorrect credentials show error', async ({ page }) => {
    await page.fill('#username', 'wronuser@wrong.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('#goLogin1');
    await expect(page.locator('.mbsc-toast')).toHaveText('ID o password incorrecto(s)');
  });

  //Brute force vulnerability test
  //Needs CAPTCHA to verify you are not a bot
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

  //Actual brute force attempt test. It shouldn't work. Only test in test.only.
  test.skip('Brute force attempt', async ({ page }) => {
    let pass = 1000;
    for (let i = 0; i < 300; i++) {
      pass += 1; 
      await page.fill('#username', 'danq97@gmail.com');
      await page.fill('#password', pass.toString()); 
      await page.click('#goLogin1');
  
      const loginSuccess = await page.locator('#login2').isVisible();

      if (loginSuccess) {
        console.log('Login successful on attempt: ' + pass);
        await page.screenshot({ path: 'brute_force_attempt.png', fullPage: true });

        break;
      }
    }
    const welcomeText = await page.locator('#login2 .login-title').innerText();
    expect(welcomeText).toContain('BIENVENID@');
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
    //await page.screenshot({ path: 'mobiscroll_debug.png', fullPage: true });

  });

  //Verifying that the PHPSESSID cookie is set and persists across requests ensures that users are authenticated. 
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
    expect(expiryDate).toBeGreaterThan(currentTime);  // For the expiry date 
  });
  
});