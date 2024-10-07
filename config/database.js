const { Sequelize } = require('sequelize');

// Remplacez 'database_name', 'username' et 'password' par vos informations MySQL
const sequelize = new Sequelize('gestion_taches', 'root', 'n41445524', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
