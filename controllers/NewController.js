const { New } = require('../models/NewModel');
// Importamos todos los modelos para las relaciones
const { Category } = require('../models/CategoryModel');
const { State } = require('../models/StateModel');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');
// --- 1. IMPORTAMOS VALIDATIONRESULT ---
const { validationResult } = require('express-validator');

// Nota: evitamos usar `include` porque las asociaciones no están definidas en los modelos.
// Cargamos manualmente categoria, estado y el usuario (con su perfil) cuando sea necesario.

const get = async (request, response) => {
    console.log('➡️  Intentando obtener noticias...');
    try {
        const safeQuery = { ...request.query };
        delete safeQuery.include;
        delete safeQuery.attributes;
        delete safeQuery.includeNames;
        const news = await New.findAll({ where: safeQuery });

        const newsWithRelations = await Promise.all(
            news.map(async (n) => {
                const plain = n.get({ plain: true });

                if (plain.categoria_id) {
                    const categoria = await Category.findByPk(plain.categoria_id, { attributes: ['id', 'nombre'] });
                    plain.categoria = categoria ? categoria.get({ plain: true }) : null;
                } else {
                    plain.categoria = null;
                }

                if (plain.estado_id) {
                    const estado = await State.findByPk(plain.estado_id, { attributes: ['id', 'nombre'] });
                    plain.estado = estado ? estado.get({ plain: true }) : null;
                } else {
                    plain.estado = null;
                }

                if (plain.usuario_id) {
                    const usuario = await User.findByPk(plain.usuario_id, { attributes: ['id', 'nick', 'nombre', 'apellidos', 'email', 'perfil_id'] });
                    if (usuario) {
                        const userPlain = usuario.get({ plain: true });
                        if (userPlain.perfil_id) {
                            const perfil = await Profile.findByPk(userPlain.perfil_id, { attributes: ['id', 'nombre'] });
                            userPlain.perfil = perfil ? perfil.get({ plain: true }) : null;
                        } else {
                            userPlain.perfil = null;
                        }
                        plain.usuario = userPlain;
                    } else {
                        plain.usuario = null;
                    }
                } else {
                    plain.usuario = null;
                }

                return plain;
            })
        );

        console.log(`✅  Consulta GET de noticias exitosa. Se encontraron ${newsWithRelations.length} registros.`);
        return response.json(newsWithRelations);
    } catch (err) {
        console.log('❌  Error en consulta GET de noticias:', err);
        return response.status(500).send('Error consultando los datos');
    }
};

const getById = async (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener noticia con ID: ${id}`);
    try {
        const entitie = await New.findByPk(id);
        if (!entitie) {
            console.log(`⚠️  No se encontró noticia con ID: ${id}`);
            return response.status(404).send('Recurso no encontrado');
        }

        const plain = entitie.get({ plain: true });

        if (plain.categoria_id) {
            const categoria = await Category.findByPk(plain.categoria_id, { attributes: ['id', 'nombre'] });
            plain.categoria = categoria ? categoria.get({ plain: true }) : null;
        } else {
            plain.categoria = null;
        }

        if (plain.estado_id) {
            const estado = await State.findByPk(plain.estado_id, { attributes: ['id', 'nombre'] });
            plain.estado = estado ? estado.get({ plain: true }) : null;
        } else {
            plain.estado = null;
        }

        if (plain.usuario_id) {
            const usuario = await User.findByPk(plain.usuario_id, { attributes: ['id', 'nick', 'nombre', 'apellidos', 'email', 'perfil_id'] });
            if (usuario) {
                const userPlain = usuario.get({ plain: true });
                if (userPlain.perfil_id) {
                    const perfil = await Profile.findByPk(userPlain.perfil_id, { attributes: ['id', 'nombre'] });
                    userPlain.perfil = perfil ? perfil.get({ plain: true }) : null;
                } else {
                    userPlain.perfil = null;
                }
                plain.usuario = userPlain;
            } else {
                plain.usuario = null;
            }
        } else {
            plain.usuario = null;
        }

        console.log('✅  Consulta GET by ID de noticia exitosa.');
        return response.json(plain);
    } catch (err) {
        console.log('❌  Error en consulta GET by ID de noticia:', err);
        return response.status(500).send('Error al consultar el dato');
    }
};

const create = async (request, response) => {
    // --- 2. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    console.log('➡️  Intentando crear una nueva noticia con body:', request.body);
    try {
        const newEntitie = await New.create(request.body);
        const plain = newEntitie.get({ plain: true });
        return response.status(201).json(plain);
    } catch (err) {
        console.log('❌  Error al crear noticia:', err);
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
    console.log(`➡️  Intentando actualizar noticia con ID: ${id}`);
    try {
        const [numRowsUpdated] = await New.update(request.body, { where: { id: id } });
        console.log(`✅  Se actualizaron ${numRowsUpdated} noticias.`);
        if (numRowsUpdated > 0) {
            return response.status(200).send('Registro actualizado');
        } else {
            return response.status(404).send('No se encontró el registro para actualizar.');
        }
    } catch (err) {
        console.log('❌  Error al actualizar noticia:', err);
        return response.status(500).send('Error al actualizar');
    }
};

const destroy = async (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar noticia con ID: ${id}`);
    try {
        const numRowsDeleted = await New.destroy({ where: { id: id } });
        console.log(`✅  Se eliminaron ${numRowsDeleted} noticias.`);
        if (numRowsDeleted > 0) {
            return response.status(200).send(`${numRowsDeleted} registro eliminado`);
        } else {
            return response.status(404).send('El registro no fue encontrado.');
        }
    } catch (err) {
        console.log('❌  Error al eliminar noticia:', err);
        return response.status(500).send('Error al eliminar');
    }
};

module.exports = { get, getById, create, update, destroy };