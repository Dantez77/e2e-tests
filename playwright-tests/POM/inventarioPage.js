class InventarioPage {
  static MAIN = {
    ENTRADAS: 'entradas',
    SALIDAS: 'salidas',
    LINEAS_DE_PRODUCTOS: 'lineasDeProductos',
    MARCAS_DE_PRODUCTOS: 'marcasDeProductos',
  };

  static MOVIMIENTOS = {
    TRANSFERENCIA_ALMACENES: 'transferenciaEntreAlmacenes',
    ALIMENTAR_CONTEO: 'alimentarConteo',
    GENERAR_AJUSTES_CONTEO: 'generarAjustarConteo',
  };

  static INFORMES = {
    EXISTENCIAS_ALMACEN: 'existenciasAlmacen',
  };

  static CONFIGURACIONES = {
   
  };

  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://azteq.club/azteq-club/menu/menu.php';

    this.moduloCompras = page.getByRole('link', { name: 'btn-moduloInventario' });

    this.main = {
      movimientos: page.getByRole('button', { name: 'Movimientos', exact: true }),
      informesConsultas: page.getByRole('button', { name: 'Informes y consultas', exact: true }),
      configuraciones: page.getByRole('button', { name: 'Configuración', exact: true }),

      //SubModulos
      entradas: page.getByRole('link', { name: 'Entradas', exact: true }),
      lineasDeProductos: page.getByRole('link', { name: 'Lineas de productos', exact: true }),
      marcasDeProductos: page.getByRole('link', { name: 'Marcas de productos', exact: true }),
      salidas: page.getByRole('link', { name: 'Salidas', exact: true }),      
    };

    this.movimientos = {
      transferenciaEntreAlmacenes: page.getByText('Transferencia entre almacenes'),
      alimentarConteo: page.getByText('Alimentar conteo físico'),
      generarAjustarConteo: page.getByText('Generar ajustes de conteo físico'),
    };

    this.informes = {
      comprasPorFecha: page.getByText('Compras por fecha'),
      existenciasAlmacen: page.getByText('Existencias por almacén'),
    };

    this.configuraciones = {

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

  async goToMovimientos(nombre) {
    await this.goto();
    await this.main.movimientos.click();
    await this.movimientos[nombre].click();
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

module.exports = { InventarioPage };