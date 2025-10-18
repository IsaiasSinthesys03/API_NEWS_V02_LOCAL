// Archivo: AuthController.js
// controllers/AuthController.js (refactorizado)
const { User } = require('../models/UserModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    const { email, password } = request.body;

    try {
        // Incluir password explícitamente porque defaultScope lo excluye
        const usuario = await User.scope(null).findOne({
            where: { email, activo: true },
            attributes: ['id', 'perfil_id', 'nombre', 'apellidos', 'nick', 'email', 'password'],
        });

        if (!usuario) {
            return response.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return response.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // crear payload sin la contraseña
        const { password: _pwd, ...userSafe } = usuario.get({ plain: true });

            const token = jwt.sign({ usuario: userSafe }, process.env.JWT_SECRET || 'mi_llave_secreta', {
            expiresIn: '24h',
        });

        return response.status(200).json({ token });
    } catch (err) {
        console.error('Error en login:', err);
        return response.status(500).json({ message: 'Error interno' });
    }
};

const register = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    try {
        const userData = {
            nombre: request.body.nombre,
            apellidos: request.body.apellidos,
            nick: request.body.nick,
            email: request.body.email,
            password: request.body.password,
            perfil_id: 1,
            activo: true,
            UserAlta: request.body.UserAlta || 'Admin',
        };

        const newUser = await User.create(userData);

        // defaultScope ocultará password
        return response.status(201).json(newUser);
    } catch (err) {
        console.error('Error en register:', err);
        return response.status(500).json({ message: 'Error al crear usuario' });
    }
};

module.exports = {
    login,
    register,
};


