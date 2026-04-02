// Capa de persistencia (lectura/escritura de db.json)
const fs = require("fs");
const path = require("path");

// Ruta al archivo de datos
const DB_PATH = path.join(__dirname, "db.json");

// Leer todos los contactos del archivo
function readData() {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
}

// Escribir contactos al archivo
function writeData(contacts) {
    fs.writeFileSync(DB_PATH, JSON.stringify(contacts, null, 2));
}

// Obtener todos los contactos
function getAll() {
    return readData();
}

// Obtener un contacto por su ID
function getById(id) {
    const contacts = readData();
    return contacts.find((c) => c.id === id);
}

// Generar el siguiente ID disponible
function getNextId() {
    const contacts = readData();
    if (contacts.length === 0) return 1;
    return Math.max(...contacts.map((c) => c.id)) + 1;
}

// Insertar un nuevo contacto
function insert(contact) {
    const contacts = readData();
    contacts.push(contact);
    writeData(contacts);
    return contact;
}

// Actualizar un contacto existente por ID
function updateById(id, updatedData) {
    const contacts = readData();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return null;

    // Mantener el ID original y actualizar los demás campos
    contacts[index] = { ...contacts[index], ...updatedData, id };
    writeData(contacts);
    return contacts[index];
}

// Eliminar un contacto por ID
function deleteById(id) {
    const contacts = readData();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const deleted = contacts.splice(index, 1)[0];
    writeData(contacts);
    return deleted;
}

// Exportar todas las funciones
module.exports = {
    getAll,
    getById,
    getNextId,
    insert,
    updateById,
    deleteById
};