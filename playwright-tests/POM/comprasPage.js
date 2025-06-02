class ComprasPage {
  static MAIN = {
    ALMACENES: 'almacenes',
    COMPRAS_AL_EXTERIOR: 'comprasAlExterior',
    COMPRAS_LOCALES: 'comprasLocales',
    COMPRAS_SUJETOS_EXCLUIDOS: 'comprasSujetosExcluidos',
    GRUPOS_DE_PROVEEDORES: 'gruposDeProveedores',
    POLIZAS_DE_IMPORTACION: 'polizasDeImportacion',
    PRODUCTOS: 'productos',
    PROVEEDORES: 'proveedores',
    RETACEO_DE_COSTOS: 'retaceoDeCostos',
    SUCURSALES: 'sucursales'
  };

  static INFORMES = {
    COMPRAS_POR_FECHA: 'comprasPorFecha',
    COMPRAS_POR_PRODUCTO: 'comprasPorProducto',
    COMPRAS_POR_PROVEEDOR: 'comprasPorProveedor',
    COMPRAS_POR_SUCURSAL: 'comprasPorSucursal',
    LIBRO_DE_COMPRAS: 'libroDeCompras',
    RETACEO_DE_POLIZA: 'retaceoDePolizaImportacion',
    RETENCIONES_IVA: 'retencionesIVA',
  };

  static CONFIGURACIONES = {
    COMPRADORES: 'compradores',
    COMPRAS_NUMERO_PROVISIONAL: 'comprasNumeroProvisional',
    CONCEPTOS_DE_GASTOS: 'conceptosDeGastos',
    DATOS_DE_LA_EMPRESA: 'datosDeLaEmpresa',
    GENERAR_NOMINA: 'generarNomina',
    NUMERACION_DE_DOCUMENTOS: 'numeracionDeDocumentos',
    PERIODO_DE_TRABAJO: 'periodoDeTrabajo',
    TRANSFERENCIAS_NUM_PROV: 'transferenciasConNumeroProvisional'
  };

  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://azteq.club/azteq-club/menu/menu.php';

    this.moduloCompras = page.getByRole('link', { name: 'btn-moduloCompras' });

    this.main = {
      informesConsultas: page.getByRole('button', { name: 'Informes y consultas', exact: true }),
      configuraciones: page.getByRole('button', { name: 'Configuración', exact: true }),

      //SubModulos
      almacenes: page.getByRole('link', { name: 'Almacenes', exact: true }),
      comprasAlExterior: page.getByRole('link', { name: 'Compras al exterior', exact: true }),
      comprasLocales: page.getByRole('link', { name: 'Compras locales', exact: true }),
      comprasSujetosExcluidos: page.getByRole('link', { name: 'Compras a sujetos excluidos', exact: true }),
      gruposDeProveedores: page.getByRole('link', { name: 'Grupos de proveedores', exact: true }),
      polizasDeImportacion: page.getByRole('link', { name: 'Pólizas de importación', exact: true }),
      productos: page.getByRole('link', { name: 'Productos', exact: true }),
      proveedores: page.getByRole('link', { name: 'Proveedores', exact: true }),
      retaceoDeCostos: page.getByRole('link', { name: 'Retaceo de costos', exact: true }),
      sucursales: page.getByRole('link', { name: 'Sucursales', exact: true }),
    };

    this.informes = {
      comprasPorFecha: page.getByText('Compras por fecha'),
      comprasPorProducto: page.getByText('Compras por producto'),
      comprasPorProveedor: page.getByText('Compras por proveedor'),
      comprasPorSucursal: page.getByText('Compras por sucursal'),
      libroDeCompras: page.getByText('Libro de compras'),
      retaceoDePolizaImportacion: page.getByText('Retaceo de póliza de importación'),
      retencionesIVA: page.getByText('Retenciones 1% IVA'),
    };

    this.configuraciones = {
      compradores: page.getByText('Compradores'),
      comprasNumeroProvisional: page.getByText('Compras con número provisional'),
      conceptosDeGastos: page.getByText('Conceptos de gastos'),
      datosDeLaEmpresa: page.getByText('Datos de la empresa'),
      generarNomina: page.getByText('Generar CSE de nómina honorarios'),
      numeracionDeDocumentos: page.getByText('Numeración de documentos'),
      periodoDeTrabajo: page.getByText('Período de trabajo'),
      transferenciasConNumeroProvisional: page.getByText('Transferencias con número provisional'),
    };
  }

  async goto() {
    await this.page.goto(this.baseUrl);
    await this.moduloCompras.click();
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

module.exports = { ComprasPage };