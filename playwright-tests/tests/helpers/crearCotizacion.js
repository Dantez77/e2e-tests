// helpers/crearCotizacion.js

/**
 * Crea una Factura en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframeElement - Frame principal donde se interactúa.
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */


async function crearCotizacion(page, iframeElement) {
    await page.getByRole('link', { name: 'Cotización' }).click();

    await iframeElement.getByRole('textbox', { name: 'Cliente' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();

    await iframeElement.getByRole('textbox', { name: 'Termino de Pago' }).click();
    await iframeElement.getByRole('option', { name: 'Contado' }).click();

    await iframeElement.getByRole('textbox', { name: 'Válido hasta' }).fill('2099-11-11');
    const documentValue = await iframeElement.locator('input#coddoc').inputValue();

    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    await iframeElement.getByRole('textbox', { name: 'Código' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();

    await iframeElement.locator('#btnConfirmAddLine').click();
    await iframeElement.getByRole('button', { name: 'Grabar Documento' }).click();
    await iframeElement.getByRole('button', { name: 'Cancel' }).click();

    return documentValue;
}

module.exports = { crearCotizacion };
