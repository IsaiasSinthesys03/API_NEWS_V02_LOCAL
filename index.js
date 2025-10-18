// Archivo: index.js
// index.js (Versión Mejorada)

const express = require('express');
const cors = require('cors');
const { connection } = require('./config.db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { PORT } = require('./config');

// Importar modelos
require('./models/ProfileModel');
require('./models/CategoryModel');
require('./models/StateModel');
require('./models/UserModel');
require('./models/NewModel');

// Importar rutas
const profileRoutes = require('./routes/ProfileRoute');
const stateRoutes = require('./routes/StateRoute');
const categoryRoutes = require('./routes/CategoryRoute');
const newRoutes = require('./routes/NewRoute');
const userRoutes = require('./routes/UserRoute');
const authRoutes = require('./routes/AuthRoute'); // Importar la nueva ruta

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ApiNews - Documentación de API',
            version: '1.0.0',
            description: 'API REST para gestionar un sistema de noticias, desarrollada en Express.js y Sequelize.',
        },
        servers: [
            {
                url: `http://localhost:3000`,
                description: 'Servidor de Desarrollo'
            }
        ],
        tags: [
            { name: 'Authentication', description: 'Endpoints para registro e inicio de sesión' },
            { name: 'Users', description: 'API para la gestión de usuarios' },
            { name: 'Categories', description: 'API para la gestión de categorías' },
            { name: 'States', description: 'API para la gestión de estados' },
            { name: 'Profiles', description: 'API para la gestión de perfiles' },
            { name: 'News', description: 'API para la gestión de noticias' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Endpoint de documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Usar las rutas
app.use('/api', profileRoutes, stateRoutes, categoryRoutes, newRoutes, userRoutes, authRoutes);

// Función principal para arrancar el servidor
async function startServer() {
    try {
        // 1. Primero, intenta sincronizar con la base de datos
        await connection.sync({ force: false });
        console.log('✅ Modelos sincronizados correctamente con la base de datos.');

        // 2. Si la sincronización es exitosa, inicia el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
            console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
            console.log(`🔗 Base API:   http://localhost:${PORT}/api`);
            console.log(`   • Usuarios:  GET/POST http://localhost:${PORT}/api/usuarios`);
            console.log(`   • Categorías: GET/POST http://localhost:${PORT}/api/categorias`);
            console.log(`   • Estados:    GET/POST http://localhost:${PORT}/api/estados`);
            console.log(`   • Perfiles:   GET/POST http://localhost:${PORT}/api/perfiles`);
            console.log(`   • Noticias:   GET/POST http://localhost:${PORT}/api/noticias`);
        });

    } catch (error) {
        // 3. Si hay un error en la conexión, muéstralo y no inicies el servidor
        console.error('❌ Error al conectar con la base de datos:', error);
    }
}

// Llama a la función para iniciar todo el proceso
startServer();

module.exports = app;