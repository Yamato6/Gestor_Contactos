// Capa de lógica de negocio y validaciones
const repository = require("./repository");

// Validar formato básico de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar que el teléfono tenga solo dígitos
function isValidPhone(phone) {
    const phoneRegex = /^\d{8,15}$/; // entre 8 y 15 dígitos
    return phoneRegex.test(phone);
}

// Normalizar datos de entrada
function normalizeContactData(data) {
    return {
        name: typeof data.name === "string" ? data.name.trim() : "",
        phone: typeof data.phone === "string" ? data.phone.trim() : "",
        email: typeof data.email === "string" ? data.email.trim().toLowerCase() : ""
    };
}

// Validar datos del contacto
function validateContactData(data) {
    const errors = [];

    // name: 2 a 60 caracteres
    if (!data.name) {
        errors.push("El nombre es obligatorio.");
    } else if (data.name.length < 2 || data.name.length > 60) {
        errors.push("El nombre debe tener entre 2 y 60 caracteres.");
    }

    // phone: solo números, 8 a 15 dígitos
    if (!data.phone) {
        errors.push("El teléfono es obligatorio.");
    } else if (!isValidPhone(data.phone)) {
        errors.push("El teléfono debe contener solo números (8 a 15 dígitos).");
    }

    // email: 5 a 100 caracteres y formato válido
    if (!data.email) {
        errors.push("El email es obligatorio.");
    } else if (data.email.length < 5 || data.email.length > 100) {
        errors.push("El email debe tener entre 5 y 100 caracteres.");
    } else if (!isValidEmail(data.email)) {
        errors.push("El formato del email no es válido.");
    }

    return errors;
}

// Buscar contacto por email exacto (para validar duplicados)
function findByEmail(email) {
    const contacts = repository.getAll();
    return contacts.find((c) => c.email.toLowerCase() === email.toLowerCase());
}

// Obtener todos los contactos (con búsqueda opcional)
function findAll(search) {
    const contacts = repository.getAll();

    // Si no hay término de búsqueda, regresar todo
    if (!search || !search.trim()) return contacts;

    const term = search.trim().toLowerCase();

    // Buscar por nombre o email (coincidencia parcial)
    return contacts.filter(
        (c) =>
            c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term)
    );
}

// Obtener contacto por ID
function findById(id) {
    return repository.getById(id);
}

// Crear contacto
function create(data) {
    const normalized = normalizeContactData(data);

    // Validaciones generales
    const errors = validateContactData(normalized);
    if (errors.length > 0) {
        return { ok: false, status: 400, errors };
    }

    // Validar email único
    const existing = findByEmail(normalized.email);
    if (existing) {
        return {
            ok: false,
            status: 400,
            errors: ["El email ya está registrado por otro contacto."]
        };
    }

    // Generar contacto final
    const newContact = {
        id: repository.getNextId(),
        name: normalized.name,
        phone: normalized.phone,
        email: normalized.email
    };

    const saved = repository.insert(newContact);
    return { ok: true, status: 201, data: saved };
}

// Actualizar contacto por ID
function update(id, data) {
    const existing = repository.getById(id);
    if (!existing) {
        return { ok: false, status: 404, errors: ["Contacto no encontrado."] };
    }

    const normalized = normalizeContactData(data);

    // Validaciones generales
    const errors = validateContactData(normalized);
    if (errors.length > 0) {
        return { ok: false, status: 400, errors };
    }

    // Validar email único (excepto el contacto actual)
    const contacts = repository.getAll();
    const emailInUse = contacts.find(
        (c) => c.email.toLowerCase() === normalized.email.toLowerCase() && c.id !== id
    );

    if (emailInUse) {
        return {
            ok: false,
            status: 400,
            errors: ["El email ya está registrado por otro contacto."]
        };
    }

    const updated = repository.updateById(id, {
        name: normalized.name,
        phone: normalized.phone,
        email: normalized.email
    });

    return { ok: true, status: 200, data: updated };
}

// Eliminar contacto por ID
function remove(id) {
    const deleted = repository.deleteById(id);

    if (!deleted) {
        return { ok: false, status: 404, errors: ["Contacto no encontrado."] };
    }

    return { ok: true, status: 200, data: deleted };
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};