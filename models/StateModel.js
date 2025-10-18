// Archivo: StateModel.js
// StateModel.js
const { DataTypes } = require('sequelize');
const { connection } = require("../config.db");

const State = connection.define('state', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  abreviacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  UserAlta: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Admin",
  },
  FechaAlta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: "1990-01-01T00:00:00.000Z"
  },
  UserMod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaMod: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:'1990-01-01T00:00:00.000Z'
  },
  UserBaja: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  FechaBaja: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:'1990-01-01T00:00:00.000Z'
  },
})

module.exports = { State };