// controllers/ProfileController.js
const { Profile } = require('../models/ProfileModel');

const get = (request, response) => {
    console.log('➡️  Intentando obtener perfiles...');
    Profile.findAll({ where: request.query })
        .then(entities => {
            console.log(`✅  Consulta GET de perfiles exitosa. Se encontraron ${entities.length} registros.`);
            response.json(entities);
        })
        .catch(err => {
            console.log('❌  Error en consulta GET de perfiles:', err);
            response.status(500).send('Error consultando los datos');
        });
};

const getById = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando obtener perfil con ID: ${id}`);
    Profile.findByPk(id)
        .then(entitie => {
            if (entitie) {
                console.log('✅  Consulta GET by ID de perfil exitosa.');
                response.json(entitie);
            } else {
                console.log(`⚠️  No se encontró perfil con ID: ${id}`);
                response.status(404).send('Recurso no encontrado');
            }
        })
        .catch(err => {
            console.log('❌  Error en consulta GET by ID de perfil:', err);
            response.status(500).send('Error al consultar el dato');
        });
};

const create = (request, response) => {
    console.log('➡️  Intentando crear un nuevo perfil con body:', request.body);
    Profile.create(request.body)
        .then(newEntitie => {
            console.log('✅  Perfil creado exitosamente.');
            response.status(201).json(newEntitie);
        })
        .catch(err => {
            console.log('❌  Error al crear perfil:', err);
            response.status(500).send('Error al crear');
        });
};

const update = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando actualizar perfil con ID: ${id}`);
    Profile.update(request.body, { where: { id: id } })
        .then(numRowsUpdatedArray => {
            const numRowsUpdated = numRowsUpdatedArray[0];
            console.log(`✅  Se actualizaron ${numRowsUpdated} perfiles.`);
            if (numRowsUpdated > 0) {
                response.status(200).send('Registro actualizado');
            } else {
                response.status(404).send('No se encontró el registro para actualizar.');
            }
        })
        .catch(err => {
            console.log('❌  Error al actualizar perfil:', err);
            response.status(500).send('Error al actualizar');
        });
};

const destroy = (request, response) => {
    const id = request.params.id;
    console.log(`➡️  Intentando eliminar perfil con ID: ${id}`);
    Profile.destroy({ where: { id: id } })
        .then(numRowsDeleted => {
            console.log(`✅  Se eliminaron ${numRowsDeleted} perfiles.`);
            if (numRowsDeleted > 0) {
                response.status(200).send(`${numRowsDeleted} registro eliminado`);
            } else {
                response.status(404).send('El registro no fue encontrado.');
            }
        })
        .catch(err => {
            console.log('❌  Error al eliminar perfil:', err);
            response.status(500).send('Error al eliminar');
        });
};

module.exports = { get, getById, create, update, destroy };