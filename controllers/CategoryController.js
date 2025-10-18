const { Category } = require('../models/CategoryModel');
// --- 1. IMPORTAMOS VALIDATIONRESULT ---
const { validationResult } = require('express-validator');

// --- OBTENER TODAS LAS CATEGORÍAS (GET) ---
const get = (request, response) => {
    console.log('➡️  Intentando obtener categorías...');
    
    const { nombre, descripcion, activo, useralta } = request.query;
    const filters = {};
    if (nombre) { filters.nombre = nombre; }
    if (descripcion) { filters.descripcion = descripcion; }
    if (activo) { filters.activo = activo; }
    if (useralta) { filters.useralta = useralta; }

    Category.findAll({ where: filters })
        .then(entities => {
            console.log('✅  Consulta GET exitosa. Se encontraron', entities.length, 'registros.');
            response.json(entities);
        })
        .catch(err => {
            console.log('❌  Error en consulta GET:', err);
            response.status(500).send('Error consultando los datos');
        });
};

// --- OBTENER UNA CATEGORÍA POR ID (GET) ---
const getById = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener categoría con ID: ${id}`);
    
    Category.findByPk(id)
        .then(entitie => {
            if (entitie) {
                console.log('✅  Consulta GET by ID exitosa.');
                response.json(entitie);
            } else {
                console.log(`⚠️  No se encontró categoría con ID: ${id}`);
                response.status(404).send('Recurso no encontrado');
            }
        })
        .catch(err => {
            console.log('❌  Error en consulta GET by ID:', err);
            response.status(500).send('Error al consultar el dato');
        });
};

// --- CREAR UNA NUEVA CATEGORÍA (POST) ---
const create = (request, response) => {
    // --- 2. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    console.log('➡️  Intentando crear una nueva categoría con body:', request.body);

    Category.create(request.body)
        .then(newEntitie => {
            console.log('✅  Categoría creada exitosamente.');
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            console.log('❌  Error al crear categoría:', err);
            response.status(500).send('Error al crear');
        });
};

// --- ACTUALIZAR UNA CATEGORÍA (PUT) ---
const update = (request, response) => {
    // --- 3. AÑADIMOS EL MANEJO DE ERRORES DE VALIDACIÓN ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    const id = request.params.id;
    console.log(`➡️  Intentando actualizar categoría con ID: ${id}`);
    
    Category.update(request.body, { where: { id: id } })
        .then(numRowsUpdatedArray => {
            const numRowsUpdated = numRowsUpdatedArray[0];
            console.log(`✅  Se actualizaron ${numRowsUpdated} filas.`);
            if (numRowsUpdated > 0) {
                response.status(200).send(`Registro actualizado`);
            } else {
                response.status(404).send(`No se encontró el registro para actualizar.`);
            }
        })
        .catch(err => {
            console.log('❌  Error al actualizar categoría:', err);
            response.status(500).send('Error al actualizar');
        });
};

// --- ELIMINAR UNA CATEGORÍA (DELETE) ---
const destroy = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar categoría con ID: ${id}`);

    Category.destroy({ where: { id: id } })
        .then(numRowsDeleted => {
            console.log(`✅  Se eliminaron ${numRowsDeleted} filas.`);
            if (numRowsDeleted > 0) {
                response.status(200).send(`${numRowsDeleted} registro eliminado`);
            } else {
                response.status(404).send('El registro no fue encontrado.');
            }
        })
        .catch(err => {
            console.log('❌  Error al eliminar categoría:', err);
            response.status(500).send('Error al eliminar');
        });
};

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
};