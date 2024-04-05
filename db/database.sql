CREATE DATABASE IF NOT EXISTS repoayd;

USE repoayd;

CREATE TABLE usuario(
    codigo INT(10) NOT NULL,
    correo varchar(255) NOT NULL,
    contrasena varchar(255) NOT NULL,
    tipo INT(10) NOT NULL,
    nombre varchar(255) NOT NULL
   
    PRIMARY KEY(codigo)

);

CREATE TABLE tipousuario(
    id INT(10) NOT NULL,
    nombre varchar(255) NOT NULL
   
    PRIMARY KEY(id)

);

CREATE TABLE tipodocumento(
    id INT(10) NOT NULL,
    nombre varchar(255) NOT NULL
   
    PRIMARY KEY(id)

);

CREATE TABLE documento(
    id INT(10) NOT NULL,
    usuariosubida int(10) NOT NULL,
    tipodocumento int(10) NOT NULL,
    descripcion varchar(300) NOT NULL,
    miembros varchar(300) NOT NULL,
    archivos varchar(300) NOT NULL,
    estado INT(10) NOT NULL,
   
    PRIMARY KEY(id)

);

-- Agregando la clave foránea para usuariosubida
ALTER TABLE documento
ADD CONSTRAINT FK_documento_usuario
FOREIGN KEY (usuariosubida) REFERENCES usuario(codigo);

-- Agregando la clave foránea para tipodocumento
ALTER TABLE documento
ADD CONSTRAINT FK_documento_tipodocumento
FOREIGN KEY (tipodocumento) REFERENCES tipodocumento(id);

-- Agregando la foranea de tipo de usuario
ALTER TABLE usuario
ADD CONSTRAINT FK_usuario_tipousuario
FOREIGN KEY (tipo) REFERENCES tipousuario(id);