// Capa de control (manejo HTTP)
const service = require("./service");

// GET /contacts?search=texto
function getAllContacts(req, res) {
    try {
        // El query param search es opcional; si no viene se listan todos.
        const search = req.query.search || "";
        const contacts = service.findAll(search);

        return res.status(200).json({
            code: 1,
            message: "Contactos obtenidos correctamente.",
            data: contacts
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: "Error interno al obtener contactos.",
            error: error.message
        });
    }
}

// GET /contacts/:id
function getContactById(req, res) {
    try {
        // Convierte el parámetro de ruta a entero seguro para validar entrada.
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                code: 0,
                message: "ID inválido."
            });
        }

        const contact = service.findById(id);
        if (!contact) {
            // No existe el recurso solicitado.
            return res.status(404).json({
                code: 0,
                message: "Contacto no encontrado."
            });
        }

        return res.status(200).json({
            code: 1,
            message: "Contacto obtenido correctamente.",
            data: contact
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: "Error interno al obtener el contacto.",
            error: error.message
        });
    }
}

// POST /contacts
function createContact(req, res) {
    try {
        // Toda la validación de negocio se centraliza en service.
        const result = service.create(req.body);

        if (!result.ok) {
            // Se respeta el status devuelto por service (ej: 400).
            return res.status(result.status).json({
                code: 0,
                message: "Error de validación.",
                errors: result.errors
            });
        }

        return res.status(result.status).json({
            code: 1,
            message: "Contacto creado correctamente.",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: "Error interno al crear el contacto.",
            error: error.message
        });
    }
}

// PUT /contacts/:id
function updateContact(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                code: 0,
                message: "ID inválido."
            });
        }

        const result = service.update(id, req.body);

        if (!result.ok) {
            // Puede devolver 400 por validación o 404 si no existe el contacto.
            return res.status(result.status).json({
                code: 0,
                message: "No se pudo actualizar el contacto.",
                errors: result.errors
            });
        }

        return res.status(result.status).json({
            code: 1,
            message: "Contacto actualizado correctamente.",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: "Error interno al actualizar el contacto.",
            error: error.message
        });
    }
}

// DELETE /contacts/:id
function deleteContact(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                code: 0,
                message: "ID inválido."
            });
        }

        const result = service.remove(id);

        if (!result.ok) {
            // Si el contacto no existe, service devuelve 404.
            return res.status(result.status).json({
                code: 0,
                message: "No se pudo eliminar el contacto.",
                errors: result.errors
            });
        }

        return res.status(result.status).json({
            code: 1,
            message: "Contacto eliminado correctamente.",
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            code: 0,
            message: "Error interno al eliminar el contacto.",
            error: error.message
        });
    }
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};