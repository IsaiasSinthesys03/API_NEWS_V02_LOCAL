const { State } = require('../models/StateModel');
const { validationResult } = require('express-validator');

const get = (request, response) => {
    console.log('➡️  Intentando obtener estados...');
    State.findAll({ where: request.query })
        .then(entities => {
            console.log(`✅  Consulta GET de estados exitosa. Se encontraron ${entities.length} registros.`);
            response.json(entities);
        })
        .catch(err => {
            console.log('❌  Error en consulta GET de estados:', err);
            response.status(500).send('Error consultando los datos');
        });
};

const getById = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener estado con ID: ${id}`);
    State.findByPk(id)
        .then(entitie => {
            if (entitie) {
                console.log('✅  Consulta GET by ID de estado exitosa.');
                response.json(entitie);
            } else {
                console.log(`⚠️  No se encontró estado con ID: ${id}`);
                response.status(404).send('Recurso no encontrado');
            }
        })
        .catch(err => {
            console.log('❌  Error en consulta GET by ID de estado:', err);
            response.status(500).send('Error al consultar el dato');
        });
};

const create = (request, response) => {
    // Este bloque ya estaba correcto
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log('⚠️  Error de validación al crear estado:', errors.mapped());
        return response.status(422).json({ errors: errors.mapped() });
    }
    console.log('➡️  Intentando crear un nuevo estado con body:', request.body);
    State.create(request.body)
        .then(newEntitie => {
            console.log('✅  Estado creado exitosamente.');
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            console.log('❌  Error al crear estado:', err);
            response.status(500).send('Error al crear');
        });
};

const update = (request, response) => {
    // --- AÑADIMOS EL MANEJO DE ERRORES AQUÍ ---
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    const id = request.params.id;
    console.log(`➡️  Intentando actualizar estado con ID: ${id}`);
    State.update(request.body, { where: { id: id } })
        .then(numRowsUpdatedArray => {
            const numRowsUpdated = numRowsUpdatedArray[0];
            console.log(`✅  Se actualizaron ${numRowsUpdated} estados.`);
            if (numRowsUpdated > 0) {
                response.status(200).send('Registro actualizado');
            } else {
                response.status(404).send('No se encontró el registro para actualizar.');
            }
        })
        .catch(err => {
            console.log('❌  Error al actualizar estado:', err);
            response.status(500).send('Error al actualizar');
        });
};

const destroy = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar estado con ID: ${id}`);
    State.destroy({ where: { id: id } })
        .then(numRowsDeleted => {
            console.log(`✅  Se eliminaron ${numRowsDeleted} estados.`);
            if (numRowsDeleted > 0) {
                response.status(200).send(`${numRowsDeleted} registro eliminado`);
            } else {
                response.status(404).send('El registro no fue encontrado.');
            }
        })
        .catch(err => {
            console.log('❌  Error al eliminar estado:', err);
            response.status(500).send('Error al eliminar');
        });
};

module.exports = { get, getById, create, update, destroy };