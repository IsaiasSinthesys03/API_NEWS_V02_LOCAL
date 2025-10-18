// Archivo: NewRoute.js
// NewRoute.js
const express = require('express');
const { get, getById, create, update, destroy } = require('../controllers/NewController');
// --- 1. IMPORTAMOS LOS VALIDADORES ---
const { validatorNewCreate, validatorNewUpdate } = require('../validators/NewValidator');
const { authenticateAny } = require('../middlewares/jwt');
const api = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     New:
 *       type: object
 *       required:
 *         - categoria_id
 *         - estado_id
 *         - usuario_id
 *         - titulo
 *         - fecha_publicacion
 *         - descripcion
 *         - imagen
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado para la noticia
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría relacionada
 *         estado_id:
 *           type: integer
 *           description: ID del estado relacionado
 *         usuario_id:
 *           type: integer
 *           description: ID del usuario autor
 *         titulo:
 *           type: string
 *           description: Título de la noticia
 *         fecha_publicacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de publicación
 *         descripcion:
 *           type: string
 *           description: Contenido o descripción de la noticia
 *         imagen:
 *           type: string
 *           description: URL de la imagen asociada
 *         activo:
 *           type: boolean
 *           description: Indica si la noticia está activa
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
 *         id: 10
 *         categoria_id: 1
 *         estado_id: 1
 *         usuario_id: 2
 *         titulo: "Nuevo lanzamiento de smartphone"
 *         fecha_publicacion: "2025-10-15T12:00:00.000Z"
 *         descripcion: "Detalles del nuevo dispositivo..."
 *         imagen: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU..."
 *         activo: true
 */

/**
 * @swagger
 * /api/noticias:
 *   get:
 *     summary: Retorna la lista de todas las noticias
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Lista de noticias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/New'
 */
api.get('/noticias', get);

/**
 * @swagger
 * /api/noticias/{id}:
 *   get:
 *     summary: Obtiene una noticia por su ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/New'
 *       404:
 *         description: La noticia no fue encontrada
 */
api.get('/noticias/:id', getById)

/**
 * @swagger
 * /api/noticias:
 *   post:
 *     summary: Crea una nueva noticia
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/New'
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
// --- 2. USAMOS EL VALIDADOR DE CREACIÓN ---
api.post('/noticias', authenticateAny, validatorNewCreate, create)

/**
 * @swagger
 * /api/noticias/{id}:
 *   put:
 *     summary: Actualiza una noticia por su ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la noticia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/New'
 *     responses:
 *       200:
 *         description: Noticia actualizada
 *       404:
 *         description: No se encontró el registro
 *       422:
 *         description: Error de validación en los datos de entrada
 *       500:
 *         description: Error del servidor
 */
// --- 3. USAMOS EL VALIDADOR DE ACTUALIZACIÓN ---
api.put('/noticias/:id', authenticateAny, validatorNewUpdate, update)

/**
 * @swagger
 * /api/noticias/{id}:
 *   delete:
 *     summary: Elimina una noticia por su ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: El ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia eliminada
 *       404:
 *         description: No se encontró el registro
 */
api.delete('/noticias/:id', authenticateAny, destroy)

module.exports = api;