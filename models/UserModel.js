// UserModel.js
const { DataTypes } = require('sequelize');
const { connection } = require("../config.db");
const bcrypt = require('bcryptjs');

const User = connection.define(
  'user',
  {
    nick: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    UserAlta: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Admin',
    },
    FechaAlta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '1990-01-01T00:00:00.000Z',
    },
    UserMod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    FechaMod: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '1990-01-01T00:00:00.000Z',
    },
    UserBaja: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    FechaBaja: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '1990-01-01T00:00:00.000Z',
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Asociaciones (declaradas después de la definición del modelo)
// Importamos Profile aquí para evitar dependencias circulares cuando se requieren en otros archivos
const { Profile } = require('./ProfileModel');
User.belongsTo(Profile, { as: 'perfil', foreignKey: 'perfil_id' });

module.exports = { User };