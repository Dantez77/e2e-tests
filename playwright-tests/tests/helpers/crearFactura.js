// helpers/crearFactura.js

/**
 * Crea una Factura en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframeElement - Frame principal donde se interactúa.
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */

async function crearFactura(page, iframeElement) {

    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    const documentValue = await iframeElement.locator('input#coddoc').inputValue();

    await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();

    await iframeElement.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframeElement.locator('[role="option"][data-index="1"]').click();


    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    await iframeElement.getByRole('textbox', { name: 'Código' }).click();
    await iframeElement.locator('[role="option"][data-index="4"]').click();
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('12');

    await iframeElement.locator('#btnConfirmAddLine').click();

    await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();

    return documentValue;
}

module.exports = { crearFactura };
