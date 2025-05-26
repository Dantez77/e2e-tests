require('dotenv').config();

//Estos test estan configurados para correr en el entorno de pruebas de Azteq Club
//Utilizar credenciales de Test Cloud o Pro, resultara en errores de autenticacion y funcionamiento
module.exports = {
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
};