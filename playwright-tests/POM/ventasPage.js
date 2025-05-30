class VentasPage {
  static INFORMES = {
    CLIENTES_POR_CODIGO: 'clientesPorCodigo',
    DETALLE_DE_VENTAS_POR_DIA: 'detalleDeVentasPorDia',
    FACTURAS_PENDIENTES_DE_COBRO: 'facturasPendientesDeCobro',
    LIBRO_VENTAS_CONSUMIDOR_FINAL: 'libroVentasConsumidorFinal',
    LIBRO_DE_VENTAS_CONTRIBUYENTES: 'libroDeVentasContribuyentes',
    RESUMEN_VENTAS_ENTRE_FECHAS: 'resumenVentasEntreFechas',
    VENTAS_POR_CLIENTE: 'ventasPorCliente',
    VENTAS_POR_VENDEDOR: 'ventasPorVendedor',
  };

  static CONFIGURACIONES = {
    MONEDA_TASA_CAMBIO: 'monedaTasaCambio',
    DATOS_DE_LA_EMPRESA: 'datosDeLaEmpresa',
    PARAMETROS_FACTURACION: 'parametrosFacturacion',
    ZONAS_DE_MERCADEO: 'zonasDeMercadeo',
    NUMERACION_DOCUMENTOS: 'numeracionDocs',
  };

  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://azteq.club/azteq-club/menu/menu.php';

    this.moduloVentas = page.getByRole('link', { name: 'btn-moduloVentas' });

    this.main = {
      informesConsultas: page.getByRole('button', { name: 'Informes y consultas', exact: true }),
      configuraciones: page.getByRole('button', { name: 'Configuración', exact: true }),
    };

    this.informes = {
      clientesPorCodigo: page.getByText('Clientes en orden de código'),
      detalleDeVentasPorDia: page.getByText('Detalle de ventas por día'),
      facturasPendientesDeCobro: page.getByText('Facturas pendientes de cobro'),
      libroVentasConsumidorFinal: page.getByText('Libro de ventas a consumidor final'),
      libroDeVentasContribuyentes: page.getByText('Libro de ventas a contribuyentes'),
      resumenVentasEntreFechas: page.getByText('Resumen de ventas entre fechas'),
      ventasPorCliente: page.getByText('Ventas por cliente'),
      ventasPorVendedor: page.getByText('Ventas por vendedor'),
    };

    this.configuraciones = {
      monedaTasaCambio: page.getByText('Monedas y tasas de cambio'),
      datosDeLaEmpresa: page.getByText('Datos de la empresa'),
      parametrosFacturacion: page.getByText('Parámetros para facturar'),
      zonasDeMercadeo: page.getByText('Zonas de mercadeo'),
      numeracionDocs: page.getByText('Numeración de documentos'),

    };
  }

  async goto() {
    await this.page.goto(this.baseUrl);
    await this.moduloVentas.click();
  }

  async goToConfiguraciones(nombre) {
    await this.goto();
    await this.main.configuraciones.click();
    await this.configuraciones[nombre].click();

  }

  async goToInformesYconsultas(nombre) {
    await this.goto();
    await this.main.informesConsultas.click();
    await this.informes[nombre].click();
  }
}

module.exports = { VentasPage };