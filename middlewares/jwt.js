// middlewares/jwt.js
const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    if (!authorization_header || !authorization_header.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'No se proporcionó un token con el formato correcto' });
    }
    const token = authorization_header.split(' ')[1];

    jwt.verify(token, 'mi_llave_secreta', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Token inválido o expirado' });
        }
        if (decoded.usuario && decoded.usuario.perfil_id === 1) {
            req.user = decoded.usuario; // Opcional: añadir usuario a la request
            next();
        } else {
            return res.status(403).send({ message: 'Sin autorización de Administrador' });
        }
    });
};

const authenticateAny = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    if (!authorization_header || !authorization_header.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'No se proporcionó un token con el formato correcto' });
    }
    const token = authorization_header.split(' ')[1];

    jwt.verify(token, 'mi_llave_secreta', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Token inválido o expirado' });
        }
        req.user = decoded.usuario; // Opcional: añadir usuario a la request
        next();
    });
};

module.exports = {
    authenticateAdmin,
    authenticateAny
};


