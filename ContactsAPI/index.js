// Punto de entrada del backend
const express = require("express");
const controller = require("./controller");

const app = express();
const PORT = 3000;

// Middleware para permitir JSON en requests
app.use(express.json());

// Middleware CORS básico (para consumir desde tus HTML)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Responder preflight requests
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        code: 1,
        message: "API de Gestor de Contactos funcionando."
    });
});

// Endpoints principales
app.get("/contacts", controller.getAllContacts);
app.get("/contacts/:id", controller.getContactById);
app.post("/contacts", controller.createContact);
app.put("/contacts/:id", controller.updateContact);
app.delete("/contacts/:id", controller.deleteContact);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        code: 0,
        message: "Ruta no encontrada."
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});