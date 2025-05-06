// helpers/crearNotaDeCredito.js

/**
 * Crea una Nota de Crédito en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframeElement - Frame principal donde se interactúa.
 * @param {string} numeroCFF - Número del Crédito Fiscal relacionado.
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */

async function crearNotaCredito(page, iframeElement, numeroCFF) {
    await page.getByRole('link', { name: 'Nota de crédito', exact: true }).click();
    await page.waitForTimeout(500);
  
    const documentValue = await iframeElement.locator('input#coddoc').inputValue();
  
    await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();
  
    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();
  
    await iframeElement.getByRole('textbox', { name: 'Crédito fiscal' }).click();
    await iframeElement.getByRole('option', { name: numeroCFF }).click();
  
    await iframeElement.getByRole('button', { name: 'Grabar Documento' }).click();
  
    // Confirmación
    await iframeElement.getByRole('button', { name: 'Buscar documento' }).click();
    await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
    await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);
  
    await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();
  
    return documentValue;
  }
  
  module.exports = { crearNotaCredito };
  