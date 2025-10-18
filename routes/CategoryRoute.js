// CategoryRoute.js
var express = require('express');
// Importamos las funciones del controlador
const { get, getById, create, update, destroy } = require('../controllers/CategoryController');
// --- 1. IMPORTAMOS LOS VALIDADORES ---
const { validatorCategoryCreate, validatorCategoryUpdate } = require('../validators/CategoryValidator');
const { authenticateAdmin } = require('../middlewares/jwt');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado para la categoría
 *         nombre:
 *           type: string
 *           description: Nombre único de la categoría
 *         descripcion:
 *           type: string
 *           description: Breve descripción de la categoría
 *         activo:
 *           type: boolean
 *           description: Indica si la categoría está activa
 *         UserAlta:
 *           type: string
 *           description: Usuario que dio de alta el registro
 *         FechaAlta:
 *           type: string
 *           format: date-time
 *           description: Fecha de alta del registro
 *         UserMod:
 *           type: string
 *           description: Último usuario que modificó el registro
 *         FechaMod:
 *           type: string
 *           format: date-time
 *           description: Fecha de última modificación
 *         UserBaja:
 *           type: string
 *           description: Usuario que dio de baja el registro
 *         FechaBaja:
 *           type: string
 *           format: date-time
 *           description: Fecha de baja
 *       example:
 *         id: 1
 *         nombre: "Tecnología"
 *         descripcion: "Noticias sobre gadgets y tecnología."
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
 * /api/categorias:
 *   get:
 *     summary: Retorna la lista de todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: La lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
api.get('/categorias', get);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: La categoría no fue encontrada
 */
api.get('/categorias/:id', getById);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: La categoría fue creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Ocurrió un error en el servidor
 */
 // --- 2. USAMOS EL VALIDADOR DE CREACIÓN ---
api.post('/categorias', authenticateAdmin, validatorCategoryCreate, create);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: La categoría fue actualizada
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       404:
 *         description: La categoría no fue encontrada
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Ocurrió un error en el servidor
 */
 // --- 3. USAMOS EL VALIDADOR DE ACTUALIZACIÓN ---
api.put('/categorias/:id', authenticateAdmin, validatorCategoryUpdate, update);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la categoría
 *     responses:
 *       200:
 *         description: La categoría fue eliminada
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (el token no corresponde a un Administrador).
 *       404:
 *         description: La categoría no fue encontrada
 */
api.delete('/categorias/:id', authenticateAdmin, destroy);

module.exports = api;