class VentasPage {
  static MAIN = {
    CLIENTES: 'clientes',
    COMPROBANTE_DONACION: 'comprobanteDedonacion',
    COTIZACION: 'cotizacion',
    CREDITO_FISCAL: 'creditoFiscal',
    FACTURA: 'factura',
    FACTURA_EXPORTACION: 'facturaExportacion',
    GRUPOS_CLIENTES: 'gruposClientes',
    NOTA_DE_CREDITO: 'notaDeCredito',
    NOTA_DE_DEBITO: 'notaDeDebito',
    PRODUCTOS: 'productos',
    SUCURSALES: 'sucursales',
    VENDEDORES: 'vendedores'
  };
  
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
    LOGO_DE_LA_EMPRESA: 'logoDeLaEmpresa',
    NOMBRES_LISTAS_PRODUCTOS: 'nombresListasProductos',
    NUMEROS_AUTORIZACION_DOCUMENTOS: 'numerosAutorizacionDocumentos',
    LINEAS_DE_PRODUCTOS: 'lineasDeProductos'
  };

  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://azteq.club/azteq-club/menu/menu.php';

    this.moduloVentas = page.getByRole('link', { name: 'btn-moduloVentas' });

    this.main = {
      informesConsultas: page.getByRole('button', { name: 'Informes y consultas', exact: true }),
      configuraciones: page.getByRole('button', { name: 'Configuración', exact: true }),

      //SubModulos
      clientes: page.getByRole('link', { name: 'Clientes', exact: true }),
      comprobanteDedonacion: page.getByRole('link', { name: 'Comprobante de donación', exact: true}),
      cotizacion: page.getByRole('link', { name: 'Cotización', exact: true }),
      creditoFiscal: page.getByRole('link', { name: 'Crédito fiscal', exact: true }),
      factura: page.getByRole('link', { name: 'Factura', exact: true }),
      facturaExportacion: page.getByRole('link', { name: 'Factura de exportación', exact: true }),
      gruposClientes: page.getByRole('link', { name: 'Grupos de clientes', exact: true }),
      notaDeCredito: page.getByRole('link', { name: 'Nota de crédito', exact: true }),
      notaDeDebito: page.getByRole('link', { name: 'Nota de débito', exact: true }),
      productos: page.getByRole('link', { name: 'Productos', exact: true }),
      sucursales: page.getByRole('link', { name: 'Sucursales', exact: true }),
      vendedores: page.getByRole('link', { name: 'Vendedores', exact: true }),
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
      logoDeLaEmpresa: page.getByText('Logo de la empresa'),
      nombresListasProductos: page.getByText('Nombres de listas de precios'),
      numerosAutorizacionDocumentos: page.getByText('Números de autorización de documentos'),
      lineasDeProductos: page.getByText('Lineas de Productos')
    };
  }

  async goto() {
    await this.page.goto(this.baseUrl);
    await this.moduloVentas.click();
  }

  async goToSubModule(nombre) {
    await this.goto();
    await this.main[nombre].click();
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