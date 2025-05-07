// helpers/busquedaDoc.js

/**
 * Crea una Factura en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframeElement - Frame principal donde se interactúa.
 * @param {string} documentValue - Numero de documento a buscar
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */

//Busca y valida que un documento existe
async function busquedaDoc(page, iframeElement, documentValue) {
    await iframeElement.getByRole('button', { name: 'Buscar Documento' }).click();
    await iframeElement.getByRole('button', { name: 'Por número de documento' }).click();
    await iframeElement.getByRole('textbox', { name: 'Num. Documento' }).fill(documentValue);

    await iframeElement.getByRole('button', { name: 'Buscar', exact: true }).click();
}

module.exports = { busquedaDoc };

