// routes/StateRoute.js
var express = require('express');
const { get, getById, create, update, destroy } = require('../controllers/StateController');
// Asumo que tienes un archivo de validadores como este:
const { validatorStateRequire, validatorStateOptional } = require('../validators/StateValidator');
const { authenticateAdmin } = require('../middlewares/jwt');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     State:
 *       type: object
 *       required:
 *         - nombre
 *         - abreviacion
 *         - activo
 *         - UserAlta
 *         - FechaAlta
 *         - UserMod
 *         - FechaMod
 *         - UserBaja
 *         - FechaBaja
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         abreviacion:
 *           type: string
 *         activo:
 *           type: boolean
 *         UserAlta:
 *           type: string
 *         FechaAlta:
 *           type: string
 *           format: date-time
 *         UserMod:
 *           type: string
 *         FechaMod:
 *           type: string
 *           format: date-time
 *         UserBaja:
 *           type: string
 *         FechaBaja:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 5
 *         nombre: "Publicado"
 *         abreviacion: "PUB"
 *         activo: true
 *         UserAlta: "Admin"
 *         FechaAlta: "1990-01-01T00:00:00.000Z"
 *         UserMod: ""
 *         FechaMod: "1990-01-01T00:00:00.000Z"
 *         UserBaja: ""
 *         FechaBaja: "1990-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Retorna la lista de todos los estados
 *     tags: [States]
 *     responses:
 *       200:
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/State'
 */
api.get('/estados', get);

/**
 * @swagger
 * /api/estados/{id}:
 *   get:
 *     summary: Obtiene un estado por su ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del estado
 *     responses:
 *       200:
 *         description: Estado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/State'
 *       404:
 *         description: El estado no fue encontrado
 */
api.get('/estados/:id', getById)

/**
 * @swagger
 * /api/estados:
 *   post:
 *     summary: Crea un nuevo estado
 *     tags: [States]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/State'
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       422:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
api.post('/estados', authenticateAdmin, validatorStateRequire, create)

/**
 * @swagger
 * /api/estados/{id}:
 *   put:
 *     summary: Actualiza un estado por su ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/State'
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       404:
 *         description: No se encontró el registro
 *       500:
 *         description: Error del servidor
 */
api.put('/estados/:id', authenticateAdmin, validatorStateOptional, update)

/**
 * @swagger
 * /api/estados/{id}:
 *   delete:
 *     summary: Elimina un estado por su ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del estado
 *     responses:
 *       200:
 *         description: Estado eliminado
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       404:
 *         description: No se encontró el registro
 */
api.delete('/estados/:id', authenticateAdmin, destroy)

module.exports = api;