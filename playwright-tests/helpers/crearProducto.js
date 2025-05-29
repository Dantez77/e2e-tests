// helpers/crearProducto.js

/**
 * Crea un producto en el iframe de productos.
 * @param {import('@playwright/test').FrameLocator} iframeElement - El frame locator del iframe donde se encuentra el formulario.
 * @param {string} uniqueId - El código único para el producto.
 * @param {string} producto - La descripción del producto.
 */


async function crearProducto(iframeElement, uniqueId, producto) {
  await iframeElement.getByRole('button', { name: 'Agregar' }).click();
  await iframeElement.getByRole('textbox', { name: 'Codigo' }).fill(uniqueId);
  await iframeElement.getByRole('textbox', { name: 'Descripcion', exact: true }).fill(producto);
  await iframeElement.getByRole('textbox', { name: 'Cod Uni. Med' }).click();
  await iframeElement.locator('[role="option"][data-index="0"]').click();
  await iframeElement.getByText('NoSí').first().click();
  await iframeElement.getByText('NoSí').nth(2).click();
  await iframeElement.getByText('NoSí').nth(1).click();
  await iframeElement.getByText('Contables').click();
  await iframeElement.getByRole('textbox', { name: 'Concepto de gastos de importación' }).click();
  await iframeElement.locator('[role="option"][data-index="0"]').click();
  await iframeElement.getByRole('textbox', { name: 'Tipo de costo/gasto' }).click();
  await iframeElement.locator('[role="option"][data-index="0"]').click();
  await iframeElement.getByText('Precios').click();
  await iframeElement.getByRole('spinbutton', { name: 'Precio 1 SIN IVA' }).fill('20');
  await iframeElement.getByRole('spinbutton', { name: 'Precio 2 SIN IVA' }).fill('22');
  await iframeElement.getByRole('button', { name: 'Grabar' }).click();
}

module.exports = { crearProducto };