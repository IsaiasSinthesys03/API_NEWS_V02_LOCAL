// Archivo: UserValidator.js
// UserValidator.js
const { check } = require('express-validator');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

const validatorUserCreate = [
    check('nombre').notEmpty().withMessage('El campo nombre es obligatorio')
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').notEmpty().withMessage('El campo apellido es obligatorio')
        .isString().withMessage('El campo apellido debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').notEmpty().withMessage('El campo nick es obligatorio')
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('email').notEmpty().withMessage('El campo email es obligatorio')
        .isEmail().withMessage('Debe ser un correo valido')
        .custom((value, { request }) => {
            return User.findOne({ where: { email: value } })
                .then((user) => {
                    if (user) {
                        throw new Error('Ya existe un usuario con el mismo email');
                    }
                });
        }),

    check('password').notEmpty().withMessage('El campo password es obligatorio')
        .isString().withMessage('El campo password debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),

    check('perfil_id').notEmpty().withMessage('El campo perfil id es obligatorio')
        .isInt().withMessage('El campo perfil id debe ser numero')
        .custom((value, { request }) => {
            return Profile.findOne({ where: { id: value } })
                .then((profile) => {
                    if (!profile) {
                        throw new Error('No existe un perfil con ese id');
                    }
                });
        }),
];

const validatorUserUpdate = [
    check('nombre').optional()
        .isString().withMessage('El campo nombre debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('apellidos').optional()
        .isString().withMessage('El campo apellido debe ser texto')
        .isLength({ min: 2, max: 100 }).withMessage('El campo debe tener entre 2 y 100 caracteres'),

    check('nick').optional()
        .isString().withMessage('El campo nick debe ser texto')
        .isLength({ min: 2, max: 20 }).withMessage('El campo debe tener entre 2 y 20 caracteres'),

    check('contraseña').optional()
        .isString().withMessage('El campo constraseña debe ser texto')
        .isLength({ min: 8 }).withMessage('El campo debe tener minimo 8 caracteres'),

    check('perfil_id').optional()
        .isInt().withMessage('El campo perfil id debe ser numero')
        .custom((value, { request }) => {
            return Profile.findOne({ where: { id: value } })
                .then((profile) => {
                    if (!profile) {
                        throw new Error('No existe un perfil con ese id');
                    }
                });
        }),
];

module.exports = {
    validatorUserCreate,
    validatorUserUpdate
}