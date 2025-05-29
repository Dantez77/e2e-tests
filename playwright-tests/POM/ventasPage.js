
class VentasPage {
  constructor(page) {
    this.page = page;

    //Modulo Ventas
    this.moduloVentas = page.getByRole('link', { name: 'btn-moduloVentas' });

    //Opciones principales
    this.informesConsultas = page.getByRole('button', { name: 'Informes y consultas', exact: true });
    this.configuraciones = page.getByRole('button', { name: 'Configuración', exact: true });

    //Informes y consultas
    this.clientesPorCodigo = page.getByText('Clientes en orden de código');


    //Configuraciones
    this.monedaTasaCambio = page.getByText('Monedas y tasas de cambio');
    this.datoEmpresa = page.getByText('Datos de la empresa');


  }

  async goto() {
    await this.page.goto('https://azteq.club/azteq-club/menu/menu.php');
    await this.moduloVentas.click();
  }

  async goToConfiguraciones() {
    await this.goto();
    await this.configuraciones.click();
  }

  // Datos de la Empresa
  async goToDatosEmpresa() {
    await this.goToConfiguraciones();
    await this.datoEmpresa.click();
  }

  // Monedas y Tasas de cambio
  async goToMonedasYtasaCambio() {
    await this.goToConfiguraciones();
    await this.monedaTasaCambio.click();
  }
}

module.exports = { VentasPage };
