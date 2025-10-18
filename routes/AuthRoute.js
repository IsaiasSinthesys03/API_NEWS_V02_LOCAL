// routes/AuthRoute.js
var express = require('express');
const { login, register, } = require('../controllers/AuthController');
const { validatorLogin, validatorRegister } = require('../validators/AuthValidator');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario.
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario.
 *       example:
 *         email: "usuario@example.com"
 *         password: "password123"
 *     UserRegistration:
 *       type: object
 *       required:
 *         - nombre
 *         - apellidos
 *         - nick
 *         - email
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *         apellidos:
 *           type: string
 *         nick:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *       example:
 *         nombre: "Nuevo"
 *         apellidos: "Usuario"
 *         nick: "newuser"
 *         email: "nuevo@example.com"
 *         password: "passwordsegura"
 * tags:
 *   - name: Authentication
 *     description: Endpoints para registro e inicio de sesión
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y retorna un token JWT
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login exitoso, token JWT retornado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Sin autorización (credenciales incorrectas o usuario inactivo).
 *       422:
 *         description: Error de validación (ej. campos faltantes).
 */
api.post('/auth/login', validatorLogin, login);

/**
 * @swagger
 * /api/auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario con perfil de contribuidor (perfil_id=2)
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Error de validación (ej. el correo ya existe).
 *       500:
 *         description: Error interno del servidor.
 */
api.post('/auth/registro', validatorRegister, register);

module.exports = api;


