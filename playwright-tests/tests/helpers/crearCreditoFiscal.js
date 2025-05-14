/**
 * Crea un Crédito Fiscal en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframe - Frame principal donde se interactúa.
 * @param {string} tipoPago - Credito o Contado
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */
async function crearCreditoFiscal(page, iframe, tipoPago) {
  try {
    // Navigate to the credit fiscal page
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
    
    // Click the Add button
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    
    // Select client
    await iframe.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    
    // Select seller
    await iframe.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframe.locator('[role="option"][data-index="0"]').click();
    
    // Select payment terms
    await iframe.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframe.getByRole('option', { name: tipoPago }).click();
    
    // Get the document number - only after all previous steps completed successfully
    const documentValue = await iframe.locator('input#coddoc').inputValue();
    
    // Add item
    await iframe.getByRole('button', { name: 'Agregar' }).click();
    await iframe.getByRole('textbox', { name: 'Código' }).click();
    await iframe.locator('[role="option"][data-index="2"]').click();
    await iframe.getByRole('spinbutton', { name: 'Cantidad' }).fill('1');
    await iframe.locator('#btnConfirmAddLine').click();
    
    // Save document
    await iframe.getByRole('button', { name: 'Grabar documento' }).click();
    
    // Close the document
    await page.getByRole('link', { name: 'Crédito fiscal Close' }).getByLabel('Close').click();
    
    // Verify we have a valid document number before returning
    if (!documentValue || documentValue.trim() === '') {
      throw new Error('No document number was generated');
    }
    
    // Add logging to help debug the issue
    console.log(`Credito Fiscal: ${documentValue}`);
    
    return documentValue;
  } catch (error) {
    console.error(`Error creating Credit Fiscal: ${error.message}`);
    throw error; // Re-throw to make test fail
  }
}

module.exports = { crearCreditoFiscal };
