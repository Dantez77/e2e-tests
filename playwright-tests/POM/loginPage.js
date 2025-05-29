// loginPage.js

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.firstLoginButton = page.locator('#goLogin1');
    this.officeDropdown = page.locator('#cdsuc');
    this.officeOption = page.getByRole('option', { name: 'Oficina central', exact: true });
    this.secondLoginButton = page.locator('#goLogin2');
  }

  async goto() {
    await this.page.goto('https://azteq.club/azteq-club/login/');
  }

  async login(credentials) {
    await this.goto();
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.firstLoginButton.click();
    await this.officeDropdown.click();
    await this.officeOption.click();
    await this.secondLoginButton.click();
    await this.page.waitForURL('**/menu/menu.php', { timeout: 10000 });
  }
}

module.exports = { LoginPage };
