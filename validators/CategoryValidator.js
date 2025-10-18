// Archivo: CategoryValidator.js
// CategoryValidator.js
const { check } = require('express-validator');
const { Category } = require('../models/CategoryModel');

const validatorCategoryCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 5, max: 50 }).withMessage('El campo debe tener entre 5 y 50 caracteres')
        .custom((value, { request }) => {
            return Category.findOne({ where: { nombre: value } })
                .then((Category) => {
                    if (Category) {
                        throw new Error('Ya existe una categoría con el mismo nombre');
                    }
                });
        }),

    check('descripcion').notEmpty().withMessage('El campo descripcion es obligatorio')
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo debe tener entre 5 y 255 caracteres')
        .custom((value, { request }) => {
            return Category.findOne({ where: { descripcion: value } })
                .then((Category) => {
                    if (Category) {
                        throw new Error('Ya existe una descripcion con el mismo nombre');
                    }
                });
        }),
        
    check('activo').optional()
        .isBoolean().withMessage('El campo activo debe ser con valor booleano')
];

const validatorCategoryUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 5, max: 50 }).withMessage('El campo debe tener entre 5 y 50 caracteres')
        .custom((value, { request }) => {
            return Category.findOne({ where: { nombre: value } })
                .then((Category) => {
                    if (Category) {
                        throw new Error('Ya existe una categoría con el mismo nombre');
                    }
                });
        }),

    check('descripcion').optional()
        .isString().withMessage('El campo descripcion debe ser texto')
        .isLength({ min: 5, max: 255 }).withMessage('El campo debe tener entre 5 y 255 caracteres')
        .custom((value, { request }) => {
            return Category.findOne({ where: { descripcion: value } })
                .then((Category) => {
                    if (Category) {
                        throw new Error('Ya existe una descripcion con el mismo nombre');
                    }
                });
        }),

    check('activo').optional()
        .isBoolean().withMessage('El campo activo debe ser con valor booleano'),
]

module.exports = {
    validatorCategoryCreate,
    validatorCategoryUpdate
}