// helpers/crearCreditoFiscal.js

/**
 * Crea una Factura en el sistema.
 * @param {import('@playwright/test').Page} page - Página de Playwright.
 * @param {import('@playwright/test').FrameLocator} iframeElement - Frame principal donde se interactúa.
 * @param {import('@playwright/test').FrameLocator} tipoPago - Frame principal donde se interactúa.
 * @returns {Promise<string>} - Devuelve el número de documento generado.
 */

async function crearCreditoFiscal(page, iframeElement, tipoPago) {
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    await iframeElement.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframeElement.getByRole('option', { name: tipoPago }).click();

    const documentValue = await iframeElement.locator('input#coddoc').inputValue();

    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Código' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('1');

    await iframeElement.locator('#btnConfirmAddLine').click();
    await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();

    await page.route('**/*.pdf', route => {
        route.abort(); // Blocks pdf pop up
    });

    return documentValue;
}

module.exports = { crearCreditoFiscal };
