/**
 * Crea un Crédito Fiscal en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframe - Frame principal donde se interactúa.
 * @param {string} tipoPago - Credito o Contado
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */
async function crearCreditoFiscal(page, iframe, tipoPago) {
  let documentValue = undefined;
  try {    
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    
    await iframe.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    
    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    
    await iframe.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframe.getByRole('option', { name: tipoPago }).click();
    
    documentValue = await iframe.locator('input#coddoc').inputValue();
    
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();
    
    await iframe.getByRole('button', { name: 'Grabar documento' }).click();
    
    await page.getByRole('link', { name: 'Crédito fiscal Close' }).getByLabel('Close').click();
    
    if (!documentValue || documentValue.trim() === '') {
      throw new Error('No document number was generated');
    }
        
    return documentValue;
  } catch (error) {
    console.error(`Error creating Credit Fiscal: ${error.message}`);
  }
}

module.exports = { crearCreditoFiscal };
