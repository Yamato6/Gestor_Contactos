# Gestor de Contactos

Aplicación web desarrollada con arquitectura cliente-servidor para la gestión de contactos personales.  
El sistema permite registrar, listar, buscar, editar y eliminar contactos mediante una API REST construida con **Node.js** y **Express**, utilizando un archivo **JSON** como mecanismo de persistencia.

## Objetivo

Implementar un sistema CRUD de contactos que cumpla con los requisitos del proyecto, aplicando separación entre frontend y backend, validaciones de datos y consumo de servicios mediante `fetch`.

## Funcionalidades principales

- Registrar nuevos contactos
- Listar todos los contactos
- Buscar contactos por nombre o correo electrónico
- Editar contactos existentes
- Eliminar contactos
- Validar datos obligatorios antes de guardar

## Datos de cada contacto

Cada contacto contiene la siguiente información:

- `id`: identificador único generado por el backend
- `name`: nombre del contacto
- `phone`: número telefónico
- `email`: correo electrónico

## Tecnologías utilizadas

### Backend
- Node.js
- Express.js
- JSON para persistencia local

### Frontend
- HTML
- CSS
- JavaScript
- Bootstrap
- Fetch API

## Estructura del proyecto

```text
ContactsAPI/
├── db.json
├── index.js
├── controller.js
├── service.js
└── repository.js

ContactsAPP/
├── index.html
├── form.html
├── contactAPP.js
├── form.js
└── styles.css
