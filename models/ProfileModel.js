// Archivo: ProfileModel.js
// ProfileModel.js
const { DataTypes } = require('sequelize');
const { connection } = require("../config.db");

const Profile = connection.define('profile', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
})

module.exports = { Profile };