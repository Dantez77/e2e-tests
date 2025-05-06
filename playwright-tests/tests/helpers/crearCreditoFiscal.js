// helpers/crearCreditoFiscal.js
async function crearCreditoFiscal(page, iframeElement) {
    await page.getByRole('link', { name: 'Crédito fiscal' }).click();
    await iframeElement.getByRole('button', { name: 'Agregar' }).click();

    await iframeElement.getByRole('textbox', { name: 'Cliente:' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();

    await iframeElement.getByRole('textbox', { name: 'Vendedor:' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    await iframeElement.getByRole('textbox', { name: 'Términos de pago' }).click();
    await iframeElement.locator('[role="option"][data-index="0"]').click();

    const documentValue = await iframeElement.locator('input#coddoc').inputValue();

    await iframeElement.getByRole('button', { name: 'Agregar' }).click();
    await iframeElement.getByRole('textbox', { name: 'Código' }).click();
    await iframeElement.locator('[role="option"][data-index="2"]').click();
    await iframeElement.getByRole('spinbutton', { name: 'Cantidad' }).fill('1');

    await iframeElement.locator('#btnConfirmAddLine').click();
    await iframeElement.getByRole('button', { name: 'Grabar documento' }).click();

    await page.route('**/*.pdf', route => {
        route.abort(); // Block the request entirely
    });

    return documentValue;
}

module.exports = { crearCreditoFiscal };
