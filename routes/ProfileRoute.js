// routes/ProfileRoute.js
var express = require('express');
const { get, getById, create, update, destroy } = require('../controllers/ProfileController');
const { authenticateAdmin } = require('../middlewares/jwt');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado para el perfil
 *         nombre:
 *           type: string
 *           description: Nombre del perfil
 *       example:
 *         id: 1
 *         nombre: "Editor"
 */

/**
 * @swagger
 * /api/perfiles:
 *   get:
 *     summary: Retorna la lista de todos los perfiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Lista de perfiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 */
// Se protege para que solo un admin vea los perfiles
api.get('/perfiles', authenticateAdmin, get);

/**
 * @swagger
 * /api/perfiles/{id}:
 *   get:
 *     summary: Obtiene un perfil por su ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del perfil
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 *       404:
 *         description: El perfil no fue encontrado
 */
api.get('/perfiles/:id', authenticateAdmin, getById);

/**
 * @swagger
 * /api/perfiles:
 *   post:
 *     summary: Crea un nuevo perfil
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       500:
 *         description: Error del servidor
 */
api.post('/perfiles', create);

/**
 * @swagger
 * /api/perfiles/{id}:
 *   put:
 *     summary: Actualiza un perfil por su ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       404:
 *         description: No se encontró el registro
 *       500:
 *         description: Error del servidor
 */
api.put('/perfiles/:id', update);

/**
 * @swagger
 * /api/perfiles/{id}:
 *   delete:
 *     summary: Elimina un perfil por su ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del perfil
 *     responses:
 *       200:
 *         description: Perfil eliminado
 *       404:
 *         description: No se encontró el registro
 */
api.delete('/perfiles/:id', destroy);

module.exports = api;
