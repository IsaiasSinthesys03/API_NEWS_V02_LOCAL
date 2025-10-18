-- =================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS PARA `APINEWS` (VERSIÓN FINAL)
-- =================================================================

-- Seleccionar la base de datos sobre la que se va a trabajar
USE db_news;

-- Borrar las tablas en orden inverso a su creación para evitar errores de claves foráneas
-- (Opcional, pero recomendado para una instalación limpia)
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS profiles;

-- =================================================================
-- Creación de Tablas
-- =================================================================

CREATE TABLE profiles (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE states (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    abreviacion VARCHAR(5) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    UserAlta VARCHAR(30) NOT NULL,
    FechaAlta DATETIME NOT NULL,
    UserMod VARCHAR(30) NOT NULL,
    FechaMod DATETIME NOT NULL,
    UserBaja VARCHAR(30) NOT NULL,
    FechaBaja DATETIME NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE users(
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    perfil_id BIGINT(20) UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nick VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    UserAlta VARCHAR(20) NOT NULL,
    FechaAlta DATETIME NOT NULL,
    UserMod VARCHAR(20) NOT NULL,
    FechaMod DATETIME NOT NULL,
    UserBaja VARCHAR(20) NOT NULL,
    FechaBaja DATETIME NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE categories(
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    UserAlta VARCHAR(20) NOT NULL,
    FechaAlta DATETIME NOT NULL,
    UserMod VARCHAR(20) NOT NULL,
    FechaMod DATETIME NOT NULL,
    UserBaja VARCHAR(20) NOT NULL,
    FechaBaja DATETIME NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE news(
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    categoria_id BIGINT(20) UNSIGNED NOT NULL,
    estado_id BIGINT(20) UNSIGNED NOT NULL,
    usuario_id BIGINT(20) UNSIGNED NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    fecha_publicacion DATETIME NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    imagen MEDIUMTEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    UserAlta VARCHAR(20) NOT NULL,
    FechaAlta DATETIME NOT NULL,
    UserMod VARCHAR(20) NOT NULL,
    FechaMod DATETIME NOT NULL,
    UserBaja VARCHAR(20) NOT NULL,
    FechaBaja DATETIME NOT NULL,
    createdAt TIMESTAMP NULL,
    updatedAt TIMESTAMP NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- =================================================================
-- Creación de Claves Foráneas
-- =================================================================

ALTER TABLE users ADD FOREIGN KEY (perfil_id) REFERENCES profiles(id);
ALTER TABLE news ADD FOREIGN KEY (categoria_id) REFERENCES categories(id);
ALTER TABLE news ADD FOREIGN KEY (estado_id) REFERENCES states(id);
ALTER TABLE news ADD FOREIGN KEY (usuario_id) REFERENCES users(id);