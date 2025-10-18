// Archivo: UserRoute.js
// UserRoute.js
var express = require('express');
const { get, getById, create, update, destroy } = require('../controllers/UserController');
// --- 1. IMPORTAMOS LOS VALIDADORES ---
const { validatorUserCreate, validatorUserUpdate } = require('../validators/UserValidator');
const { authenticateAdmin } = require('../middlewares/jwt');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nombre
 *         - apellidos
 *         - nick
*         - email
*         - password
 *         - perfil_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado para el usuario.
 *         nombre:
 *           type: string
 *           description: Nombre del usuario.
 *         apellidos:
 *           type: string
 *           description: Apellidos del usuario.
 *         nick:
 *           type: string
 *           description: Nickname o apodo único del usuario.
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico único del usuario.
*         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 8 caracteres).
 *         perfil_id:
 *           type: integer
 *           description: ID del perfil asociado al usuario.
 *         activo:
 *           type: boolean
 *           description: Indica si el usuario está activo.
 *       example:
 *         id: 1
 *         nombre: "Juan"
 *         apellidos: "Pérez"
 *         nick: "juanp"
 *         correo: "juan.perez@example.com"
*         email: "juan.perez@example.com"
*         password: "password123"
 *         perfil_id: 1
 *         activo: true
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Retorna la lista de todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 */
api.get('/usuarios', authenticateAdmin, get);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 *       404:
 *         description: El usuario no fue encontrado
 */
api.get('/usuarios/:id', authenticateAdmin, getById)

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
// --- 2. USAMOS EL VALIDADOR DE CREACIÓN ---
api.post('/usuarios', authenticateAdmin, validatorUserCreate, create)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 *       404:
 *         description: No se encontró el registro
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
// --- 3. USAMOS EL VALIDADOR DE ACTUALIZACIÓN ---
api.put('/usuarios/:id', authenticateAdmin, validatorUserUpdate, update)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autorizado (token no proporcionado o inválido).
 *       403:
 *         description: Prohibido (se requiere rol Administrador).
 *       404:
 *         description: No se encontró el registro
 */
api.delete('/usuarios/:id', authenticateAdmin, destroy)

module.exports = api;