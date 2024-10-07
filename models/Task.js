const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
});

module.exports = Task;
