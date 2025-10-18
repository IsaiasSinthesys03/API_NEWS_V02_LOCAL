// NewValidator.js
const { check } = require('express-validator');
const { Category } = require('../models/CategoryModel');
const { User } = require('../models/UserModel');
const { State } = require('../models/StateModel');

const validatorNewCreate = [
    check('categoria_id').notEmpty().withMessage('El campo categoria_id es obligatorio').isInt().withMessage('El campo categoria_id debe ser un numero entero')
        .custom((value, { request }) => {
            return Category.findOne({ where: { id: value, activo: true } })
                .then((category) => {
                    if (!category) {
                        throw new Error('No existe una categoria con ese id');
                    }
                });
        }),

    check('usuario_id').notEmpty().withMessage('El campo usuario_id es obligatorio').isInt().withMessage('El campo usuario_id debe ser un numero entero')
        .custom((value, { request }) => {
            return User.findOne({ where: { id: value, activo: true } })
                .then((user) => {
                    if (!user) {
                        throw new Error('No existe una usuario con ese id');
                    }
                });
        }),

    check('estado_id').notEmpty().withMessage('El campo estado_id es obligatorio').isInt().withMessage('El campo estado_id debe ser un numero entero')
        .custom((value, { request }) => {
            return State.findOne({ where: { id: value, activo: true } })
                .then((state) => {
                    if (!state) {
                        throw new Error('No existe una estado con ese id');
                    }
                });
        }),

    check('titulo').notEmpty().withMessage('El campo titulo es obligatorio').isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),
    check('descripcion').notEmpty().withMessage('El campo descripcion es obligatorio').isLength({ min: 2 }).withMessage('El campo descripcion debe tener al menos 2 caracteres'),
    check('imagen').notEmpty().withMessage('El campo imagen es obligatorio'),
    check('imagen').custom((value) => {
            if (typeof value !== 'string') {
                throw new Error('El campo imagen debe ser una cadena en Base64 o data:image');
            }
            const v = value.trim();
            // Caso 1: data URI (data:image/...;base64,AAAA...)
            const dataUriMatch = /^data:image\/(jpeg|png|gif|jpg);base64,/.test(v);
            if (dataUriMatch) {
                const base64String = v.split(',')[1] || '';
                const cleaned = base64String.replace(/\s+/g, '');
                if (!cleaned || !/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
                    throw new Error('El campo imagen debe ser un Base 64 válido');
                }
                return true;
            }

            // Caso 2: base64 puro (sin prefijo)
            const pure = v.replace(/\s+/g, '');
            if (/^[A-Za-z0-9+/=]+$/.test(pure)) {
                return true;
            }

            throw new Error('El campo imagen debe ser un Base 64 o un data:image/[tipo];base64,....');
        }),
    check('fecha_publicacion').optional().isISO8601().withMessage('El campo fecha_publicacion debe ser una fecha válida').default(new Date().toISOString()),
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser un booleano'),
];

const validatorNewUpdate = [
    check('categoria_id').optional().isInt().withMessage('El campo categoria_id debe ser un numero entero')
        .custom((value, { request }) => {
            return Category.findOne({ where: { id: value, activo: true } })
                .then((category) => {
                    if (!category) {
                        throw new Error('No existe una categoria con ese id');
                    }
                });
        }),
    check('usuario_id').optional().isInt().withMessage('El campo usuario_id debe ser un numero entero')
        .custom((value, { request }) => {
            return User.findOne({ where: { id: value, activo: true } })
                .then((user) => {
                    if (!user) {
                        throw new Error('No existe una usuario con ese id');
                    }
                });
        }),
    check('estado_id').optional().isInt().withMessage('El campo estado_id debe ser un numero entero')
        .custom((value, { request }) => {
            return State.findOne({ where: { id: value, activo: true } })
                .then((state) => {
                    if (!state) {
                        throw new Error('No existe una estado con ese id');
                    }
                });
        }),

    check('titulo').optional().isLength({ min: 2 }).withMessage('El campo titulo debe tener al menos 2 caracteres'),
    check('descripcion').optional().isLength({ min: 2 }).withMessage('El campo descripcion debe tener al menos 2 caracteres'),
    check('imagen').optional().custom((value) => {
        if (!value) return true; // Si es opcional y no se proporciona, es válido
        if (typeof value !== 'string') {
            throw new Error('El campo imagen debe ser una cadena en Base64 o data:image');
        }
        const v = value.trim();
        // data URI
        if (/^data:image\/(jpeg|png|gif|jpg);base64,/.test(v)) {
            const base64String = v.split(',')[1] || '';
            const cleaned = base64String.replace(/\s+/g, '');
            if (!cleaned || !/^[A-Za-z0-9+/=]+$/.test(cleaned)) {
                throw new Error('El campo imagen debe ser un Base 64 válido');
            }
            return true;
        }
        // pure base64
        const pure = v.replace(/\s+/g, '');
        if (/^[A-Za-z0-9+/=]+$/.test(pure)) return true;
        throw new Error('El campo imagen debe ser un Base 64 o un data:image/[tipo];base64,....');
    }),
    check('activo').optional().isBoolean().withMessage('El campo activo debe ser un booleano'),
];

module.exports = {
    validatorNewCreate,
    validatorNewUpdate
}