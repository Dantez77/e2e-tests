const { test, expect } = require('@playwright/test');
const credentials = require('../../config/credentials.js');
const { login } = require('../helpers/login.js');

test.describe('Modulo Compras - Elementos visibles', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    // Login y entrar al módulo de compras
    await login(page, credentials);
    const comprasBtn = page.getByRole('link', { name: 'btn-moduloCompras' });
    await expect(comprasBtn).toBeVisible();
    await comprasBtn.click();
  });

  test.beforeEach(async () => {
    await page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await page.getByRole('link', { name: 'btn-moduloCompras' }).click();
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test('Todos los elementos y opciones del módulo compras son visibles', async () => {
    // Menú principal
    await expect(page.getByRole('link', { name: 'Compras', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Compras locales' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Compras a sujetos excluidos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pólizas de importación' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Compras al exterior' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Retaceo de costos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Proveedores', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Grupos de proveedores' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Productos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Almacenes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sucursales' })).toBeVisible();

    // Informes y consultas
    await page.getByRole('button', { name: 'Informes y consultas' }).click();
    await expect(page.getByText('Libro de compras')).toBeVisible();
    await expect(page.getByText('Compras por producto')).toBeVisible();
    await expect(page.getByText('Compras por proveedor')).toBeVisible();
    await expect(page.getByText('Compras por fecha')).toBeVisible();
    await expect(page.getByText('Retaceo de póliza de')).toBeVisible();
    await expect(page.getByText('Compras por sucursal')).toBeVisible();
    await expect(page.getByText('Retenciones 1% IVA')).toBeVisible();
    await expect(page.getByText('Exportación archivos .csv')).toBeVisible();

    // Configuración
    await page.getByRole('button', { name: 'Configuración' }).click();
    await expect(page.getByText('Período de trabajo')).toBeVisible();
    await expect(page.getByText('Conceptos de gastos')).toBeVisible();
    await expect(page.getByText('Datos de la empresa')).toBeVisible();
    await expect(page.getByText('Compras con número provisional')).toBeVisible();
    await expect(page.getByText('Numeración de documentos')).toBeVisible();
    await expect(page.getByText('Logo de la empresa')).toBeVisible();
    await expect(page.getByText('Transferencias con número')).toBeVisible();
    await expect(page.getByText('Compradores')).toBeVisible();
    await expect(page.getByText('Generar CSE de nómina')).toBeVisible();

    // Facturación electrónica
    await page.getByRole('button', { name: 'Facturación electrónica' }).click();
    await expect(page.getByText('Revisión / envío de DTEs')).toBeVisible();
    await expect(page.getByText('Consulta / Re-envío de DTEs')).toBeVisible();
  });
});