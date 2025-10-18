# Documentación Técnica Detallada: API NEWS

## 1. Introducción y Visión General

API NEWS es un servicio backend REST para gestionar un sistema de noticias. Está construido con Node.js y Express.js, siguiendo una arquitectura MVC robusta. Incluye seguridad mediante JSON Web Tokens (JWT) y cifrado de contraseñas con Bcrypt, además de una validación exhaustiva de los datos de entrada.

Características clave:
- Operaciones CRUD completas para noticias, usuarios, categorías, perfiles y estados.
- Seguridad: autenticación con JWT y contraseñas cifradas con bcrypt.
- Validación: reglas con `express-validator` para proteger la integridad de los datos.
- Documentación interactiva con Swagger.

## 2. Tabla de Contenidos

- [Stack Tecnológico y Filosofía de Diseño](#3-stack-tecnológico-y-filosofía-de-diseño)
- [Guía de Puesta en Marcha](#4-guía-de-puesta-en-marcha)
- [Arquitectura y Flujo de una Petición](#5-arquitectura-y-flujo-de-una-petición)
- [Conceptos Fundamentales](#6-conceptos-fundamentales-análisis-profundo)
- [Referencia de Endpoints](#7-referencia-de-endpoints-de-la-api)
- [Documentación Interactiva (Swagger)](#8-documentación-interactiva-swagger)
- [Guía de Pruebas](#9-guía-de-pruebas)

## 3. Stack Tecnológico y Filosofía de Diseño

Este proyecto usa tecnologías escogidas por simplicidad, estabilidad y compatibilidad con aplicaciones modernas.

- **Node.js**: Plataforma rápida y ampliamente usada para APIs en JavaScript. Permite ejecutar JS en el servidor y tiene un ecosistema grande.

- **Express.js**: Framework minimalista y flexible que facilita definir rutas y middleware. Fue elegido por su simplicidad y comunidad.

- **Sequelize**: ORM que simplifica consultas SQL y mapea tablas a objetos JavaScript. Elegido para evitar escribir SQL manualmente y mejorar portabilidad.

- **MySQL**: Base de datos relacional estable y conocida, adecuada para datos estructurados como usuarios y noticias.

- **JSON Web Tokens (JWT)**: Mecanismo ligero para autenticación sin estado. Permite proteger rutas sin almacenar sesión en el servidor.

- **Bcrypt.js**: Librería probada para cifrar contraseñas. Evita almacenar contraseñas en texto plano.

- **Express-validator**: Ofrece herramientas para validar y sanear entradas HTTP antes de procesarlas.

- **Swagger**: Genera documentación interactiva a partir de comentarios en las rutas para facilitar pruebas y exploración de endpoints.

## 4. Guía de Puesta en Marcha

### Prerrequisitos

- Node.js (v14+)
- MySQL (local o remoto)

### Pasos de Instalación

1. Clonar el Repositorio

```bash
git clone https://github.com/IsaiasSinthesys03/API_NEWS_V02_LOCAL.git
```

2. Navegar al Directorio

```bash
cd API_NEWS_V02_LOCAL
```

3. Instalar Dependencias

```bash
npm install
```

4. Configurar la Base de Datos

- Crea una base de datos en MySQL (por ejemplo `db_news`).
- Ejecuta el script `scriptSQL.md` desde tu cliente MySQL para crear tablas y relaciones.

5. Configurar Variables de Entorno

En la raíz del proyecto crea un archivo `.env` con este contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=db_news
JWT_SECRET=UNA_CLAVE_MUY_SECRETA_Y_LARGA
```

6. Ejecutar el Servidor

```bash
npm start
```

Si el servidor arranca correctamente verás un mensaje similar a:

```
Servidor corriendo en http://localhost:3000
Conexión establecida con la base de datos
```

## 5. Arquitectura y Flujo de una Petición

### Estructura de Carpetas Detallada

- `/config` — Contiene la configuración de la conexión a la base de datos y utilidades de entorno. Separar la configuración facilita cambiar entornos (desarrollo, pruebas, producción).
- `/controllers` — Contiene funciones que procesan la lógica de cada endpoint (p. ej. `AuthController.js`, `NewController.js`). Mantener la lógica aquí hace el código más modular y testeable.
- `/middlewares` — Contiene funciones que se ejecutan antes o después de un controlador. `jwt.js` valida el token y controla permisos.
- `/models` — Cada archivo describe una tabla y sus campos usando Sequelize. Facilita migraciones y consultas con sintaxis JS.
- `/routes` — Define las rutas públicas de la API y conecta cada ruta con su controlador y validador.
- `/validators` — Define reglas de validación con `express-validator` para asegurar que la entrada cumple el formato esperado.
- `index.js` — Punto de entrada. Configura middlewares globales (CORS, JSON), monta rutas y arranca el servidor.

La estructura busca separar responsabilidades: cambios en validación no tocan controladores; cambios en la base de datos se limitan a modelos.

### Anatomía de una Petición Segura (Ejemplo: POST /api/usuarios)

1. Cliente envía una petición HTTP POST a `/api/usuarios` con un body JSON.
2. La ruta en `/routes/UserRoute.js` recibe la petición y la enruta hacia `UserController.create`, pero antes ejecuta una cadena de middlewares.
3. `middlewares/jwt.js` (si la ruta está protegida) valida el token JWT del header `Authorization`. Si no es válido, la petición termina con 401.
4. `validators/UserValidator.js` ejecuta reglas con `express-validator` (p. ej. `isEmail()`, `isLength({ min: 8 })`). Si alguna regla falla, la petición retorna 422 con los errores.
5. Si las validaciones pasan, el controlador `UserController.create` procesa la lógica: prepara datos, ejecuta `User.create()` mediante el modelo y retorna la respuesta JSON con 201.

Este flujo mantiene la seguridad y orden: autenticación → validación → controlador → modelo.

## 6. Conceptos Fundamentales (Análisis Profundo)

### Controladores: El Cerebro de la Lógica

En Express.js, los controladores son funciones o módulos que se utilizan para manejar y responder a las solicitudes HTTP entrantes. Separar la lógica en controladores mejora la organización y hace más fácil probar y mantener el código.

Conexión con el proyecto: en `controllers/AuthController.js`, la función `login` busca al usuario en la base de datos (mediante `User.scope(null).findOne(...)`), valida la contraseña con `bcrypt.compare(...)` y genera un JWT con `jwt.sign(...)`.

### Validaciones: El Escudo Protector de Datos

En el contexto de una API, las validaciones se refieren a los procesos y reglas utilizados para garantizar que los datos enviados por los clientes cumplen ciertos requisitos antes de ser procesados.

Conexión con el proyecto: `validators/UserValidator.js` usa `express-validator` y contiene reglas como:

- `check('email').isEmail()` — valida el formato de correo.
- `check('password').isLength({ min: 8 })` — valida longitud mínima de contraseña.
- `check('email').custom(...)` — hace una consulta a la base de datos para verificar que el email no exista ya.

Si alguna validación falla, `controllers/*` detecta esto con `validationResult(request)` y retorna un 422 con los errores antes de ejecutar la lógica principal.

### Autenticación y Autorización: Las Llaves del Reino

La autenticación y autorización son dos aspectos fundamentales para proteger recursos.

Conexión con el proyecto:

- **Autenticación:** El endpoint `POST /api/auth/login` valida credenciales y retorna un JWT. Ejemplo en `controllers/AuthController.js`.
- **Autorización:** `middlewares/jwt.js` exporta dos funciones: `authenticateAny` (verifica solo que el token sea válido) y `authenticateAdmin` (adicionalmente comprueba `perfil_id === 1`). Rutas sensibles usan `authenticateAdmin` para limitar acceso.

### Puliendo la API: CORS

Para que nuestra API sea consumida por aplicaciones web desde otros dominios, se activa CORS en `index.js` con `app.use(cors())`. Esto evita bloqueos del navegador al hacer solicitudes cross-origin.

## 7. Referencia de Endpoints de la API

| Módulo | Endpoint | Método | Autorización |
|---|---:|:---:|:---|
| Autenticación | /api/auth/login | POST | Público |
| Autenticación | /api/auth/registro | POST | Público |
| Usuarios | /api/usuarios | GET | [Admin] |
| Usuarios | /api/usuarios/:id | GET | [Admin] |
| Usuarios | /api/usuarios | POST | [Admin] |
| Noticias | /api/noticias | GET | Público |
| Noticias | /api/noticias/:id | GET | Público |
| Noticias | /api/noticias | POST | [Cualquiera] (token requerido) |
| Noticias | /api/noticias/:id | PUT | [Cualquiera] (token requerido) |
| Categorías | /api/categorias | GET | Público |
| Categorías | /api/categorias | POST | [Admin] |
| Estados | /api/estados | GET | Público |

> Nota: Revisa `routes/` para ver la lista completa y cualquier ruta adicional.

## 8. Documentación Interactiva (Swagger)

La documentación autogenerada está disponible en:

```
http://localhost:3000/api-docs
```

Allí puedes ver cada endpoint, los parámetros que acepta y probar peticiones desde el navegador.

## 9. Guía de Pruebas

Usa Postman o Swagger para probar los endpoints.

### Ejemplo 1: Login de Usuario

- **Método:** POST
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**

```json
{
  "email": "editor@test.com",
  "password": "123456"
}
```

La respuesta esperada contiene el token JWT:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

### Ejemplo 2: Obtener Recursos Protegidos (GET /api/categorias)

- **Método:** GET
- **URL:** `http://localhost:3000/api/categorias`
- **Headers:**
  - `Authorization: Bearer <TOKEN>`

En Postman, añade en la pestaña Headers la clave `Authorization` con el valor `Bearer <TOKEN>` y presiona Send.

> [INSERTAR IMAGEN DE PRUEBA DE GET A RUTA PROTEGIDA CON TOKEN EN POSTMAN AQUÍ]
