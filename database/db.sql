-- Creating the database
CREATE DATABASE miencargopty;

-- using the database
USE miencargopty;

-- creating a table
CREATE TABLE users(
    id INT(11) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    cedula INT(16) NOT NULL,
    fecha_de_nacimiento DATE NOT NULL,
    email varchar(255) NOT NULL, 
    celular varchar(255) NOT NULL, 
    direccion varchar(255) NOT NULL, 
    pais varchar(255) NOT NULL
);

ALTER TABLE users 
    ADD PRIMARY KEY (id);


SELECT * FROM users WHERE email = 'recuperar'
-- ALTER TABLE users
--     MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

-- tp show all tables
-- SHOW TABLES;

-- to describe the table
-- describe users;