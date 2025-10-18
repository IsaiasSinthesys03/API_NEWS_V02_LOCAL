const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel'); // Importamos Profile para la relación
// --- 1. IMPORTAMOS VALIDATIONRESULT ---
const { validationResult } = require('express-validator');

// Nota: evitamos usar `include` porque la asociación no está definida en los modelos.
// En su lugar obtenemos manualmente los datos relacionados por sus IDs.

const get = async (request, response) => {
    console.log('➡️  Intentando obtener usuarios...');
    try {
        // Sanitizar query params para evitar que se inyecten opciones no deseadas (include, attributes, etc.)
        const safeQuery = { ...request.query };
        delete safeQuery.include;
        delete safeQuery.attributes;
        delete safeQuery.includeNames;
        const users = await User.findAll({ where: safeQuery });

        // Para cada usuario, cargamos su perfil por perfil_id y lo adjuntamos como 'perfil'
        const usersWithProfile = await Promise.all(
            users.map(async (u) => {
                const plain = u.get({ plain: true });
                if (plain.perfil_id) {
                    const perfil = await Profile.findByPk(plain.perfil_id, { attributes: ['id', 'nombre'] });
                    plain.perfil = perfil ? perfil.get({ plain: true }) : null;
                } else {
                    plain.perfil = null;
                }
                return plain;
            })
        );

        console.log(`✅  Consulta GET de usuarios exitosa. Se encontraron ${usersWithProfile.length} registros.`);
        return response.json(usersWithProfile);
    } catch (err) {
        console.log('❌  Error en consulta GET de usuarios:', err);
        return response.status(500).send('Error consultando los datos');
    }
};

const getById = async (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener usuario con ID: ${id}`);
    try {
        const user = await User.findByPk(id);
        if (!user) {
            console.log(`⚠️  No se encontró usuario con ID: ${id}`);
            return response.status(404).send('Recurso no encontrado');
        }

        const plain = user.get({ plain: true });
        if (plain.perfil_id) {
            const perfil = await Profile.findByPk(plain.perfil_id, { attributes: ['id', 'nombre'] });
            plain.perfil = perfil ? perfil.get({ plain: true }) : null;
        } else {
            plain.perfil = null;
        }

        console.log('✅  Consulta GET by ID de usuario exitosa.');
        return response.json(plain);
    } catch (err) {
        console.log('❌  Error en consulta GET by ID de usuario:', err);
        return response.status(500).send('Error al consultar el dato');
    }
};

const create = async (request, response) => {
    // --- 2. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    console.log('➡️  Intentando crear un nuevo usuario con body:', request.body);
    try {
        const newUser = await User.create(request.body);
        const plain = newUser.get({ plain: true });
        if (plain.perfil_id) {
            const perfil = await Profile.findByPk(plain.perfil_id, { attributes: ['id', 'nombre'] });
            plain.perfil = perfil ? perfil.get({ plain: true }) : null;
        } else {
            plain.perfil = null;
        }
        console.log('✅  Usuario creado exitosamente.');
        return response.status(201).json(plain);
    } catch (err) {
        console.log('❌  Error al crear usuario:', err);
        return response.status(500).send('Error al crear');
    }
};

const update = async (request, response) => {
    // --- 3. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    const id = request.params.id;
    console.log(`➡️  Intentando actualizar usuario con ID: ${id}`);
    try {
        const [numRowsUpdated] = await User.update(request.body, { where: { id: id } });
        console.log(`✅  Se actualizaron ${numRowsUpdated} usuarios.`);
        if (numRowsUpdated > 0) {
            return response.status(200).send('Registro actualizado');
        } else {
            return response.status(404).send('No se encontró el registro para actualizar.');
        }
    } catch (err) {
        console.log('❌  Error al actualizar usuario:', err);
        return response.status(500).send('Error al actualizar');
    }
};

const destroy = async (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar usuario con ID: ${id}`);
    try {
        const numRowsDeleted = await User.destroy({ where: { id: id } });
        console.log(`✅  Se eliminaron ${numRowsDeleted} usuarios.`);
        if (numRowsDeleted > 0) {
            return response.status(200).send(`${numRowsDeleted} registro eliminado`);
        } else {
            return response.status(404).send('El registro no fue encontrado.');
        }
    } catch (err) {
        console.log('❌  Error al eliminar usuario:', err);
        return response.status(500).send('Error al eliminar');
    }
};

module.exports = { get, getById, create, update, destroy };