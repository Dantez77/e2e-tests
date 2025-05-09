async function login(page, credentials) {
  await page.goto('https://azteq.club/azteq-club/login/');
  await page.fill('#username', credentials.username);
  await page.fill('#password', credentials.password);
  await page.locator('#goLogin1').click();
  await page.locator('#cdsuc').click();
  await page.getByRole('option', { name: 'Oficina central', exact: true }).click();
  await page.locator('#goLogin2').click();

  // Wait for the menu page to load
  await page.waitForURL('**/menu/menu.php', { timeout: 10000 });
}

module.exports = { login };