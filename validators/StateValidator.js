// validators/StateValidator.js
const { check } = require('express-validator');
const { State } = require('../models/StateModel');

const validatorStateRequire = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
                   .isString().withMessage('El campo nombre debe ser texto')
                   .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres')
                   .custom((value, {request}) => {
                        return State.findOne({ where: { nombre: value } })
                        .then((state) => {
                        if (state) {
                            throw new Error('Ya existe un estado con el mismo nombre');
                        }
                        });
                   }),

    check('abreviacion').notEmpty().withMessage('El campo abreviacion es obligatorio')
                        .isString().withMessage('El campo nombre debe ser texto')
                        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres')
];

const validatorStateOptional = [
    check('nombre').optional()
                   .isString().withMessage('El campo nombre debe ser texto')
                   .isLength({ min: 2, max: 50 }).withMessage('El campo debe tener entre 2 y 50 caracteres'),

    check('abreviacion').optional()
                        .isString().withMessage('El campo nombre debe ser texto')
                        .isLength({ min: 2, max: 5 }).withMessage('El campo debe tener entre 2 y 5 caracteres'),
];

module.exports = {
    validatorStateRequire,
    validatorStateOptional
};