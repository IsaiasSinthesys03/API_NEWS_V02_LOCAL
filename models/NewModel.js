// NewModel.js
const { DataTypes } = require('sequelize');
const { connection } = require("../config.db");
const { Category } = require('./CategoryModel');
const { State } = require('./StateModel');
const { User } = require('./UserModel');

const New = connection.define('new', {
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    UserAlta: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Admin"
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

New.belongsTo(Category, { as: 'categoria', foreignKey: 'categoria_id' })
New.belongsTo(State, { as: 'estado', foreignKey: 'estado_id' })
New.belongsTo(User, { as: 'usuario', foreignKey: 'usuario_id' })

module.exports = { New };