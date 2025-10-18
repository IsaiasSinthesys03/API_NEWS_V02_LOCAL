// seed.js
const { Category } = require('./models/CategoryModel');
const { State } = require('./models/StateModel');
const { Profile } = require('./models/ProfileModel');
const { User } = require('./models/UserModel');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        // Crear o encontrar categoría
        const [category] = await Category.findOrCreate({
            where: { nombre: 'General' },
            defaults: {
                descripcion: 'Categoría general de noticias',
                activo: true,
                UserAlta: 'SYSTEM',
                FechaAlta: new Date()
            }
        });

        // Crear o encontrar estado
        const [state] = await State.findOrCreate({
            where: { nombre: 'Publicado' },
            defaults: {
                descripcion: 'Noticia publicada',
                abreviacion: 'PUB',
                activo: true,
                UserAlta: 'SYSTEM',
                FechaAlta: new Date()
            }
        });

        // Crear o encontrar perfil
        const [profile] = await Profile.findOrCreate({
            where: { nombre: 'Editor' },
            defaults: {
                descripcion: 'Editor de noticias',
                activo: true,
                UserAlta: 'SYSTEM',
                FechaAlta: new Date()
            }
        });

        // Crear o encontrar usuario
        const hashedPassword = await bcrypt.hash('123456', 10);
        const [user] = await User.findOrCreate({
            where: { email: 'editor@test.com' },
            defaults: {
                nick: 'editor1',
                nombre: 'Editor',
                apellidos: 'Principal',
                password: hashedPassword,
                perfil_id: profile.id,
                activo: true,
                UserAlta: 'SYSTEM',
                FechaAlta: new Date()
            }
        });

        console.log('Registros disponibles:');
        console.log('Categoría ID:', category.id);
        console.log('Estado ID:', state.id);
        console.log('Perfil ID:', profile.id);
        console.log('Usuario ID:', user.id);

    } catch (error) {
        console.error('Error al crear registros:', error);
    } finally {
        process.exit();
    }
}

seed();