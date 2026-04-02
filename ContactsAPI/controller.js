// Capa de control (manejo HTTP)
const service = require("./service");

// GET /contacts?search=texto
function getAllContacts(req, res) {
    try {
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
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                code: 0,
                message: "ID inválido."
            });
        }

        const contact = service.findById(id);
        if (!contact) {
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
        const result = service.create(req.body);

        if (!result.ok) {
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