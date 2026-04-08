const API_URL = "http://localhost:3000/contacts";

const form = document.getElementById("contact-form");
const title = document.getElementById("form-title");
const btn = document.getElementById("submit-btn");
const alertBox = document.getElementById("form-alert");
const imgLinkInput = document.getElementById("img_link");
const imgPreview = document.getElementById("img-preview");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Acepta URL vacia (campo opcional) o URL http/https valida.
function isValidImageUrl(url) {
  if (!url) return true;

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Actualiza la vista previa cuando el usuario escribe o al cargar edicion.
function refreshPreview(url) {
  if (url) {
    imgPreview.src = url;
    imgPreview.style.display = "block";
    return;
  }

  imgPreview.removeAttribute("src");
  imgPreview.style.display = "none";
}

imgLinkInput.addEventListener("input", function () {
  refreshPreview(this.value.trim());
});

// GET /contacts/:id
// Si viene ID, cargar contacto para editar
if (id) {
  // Ajusta textos de la UI para modo edición.
  title.textContent = "Editar Contacto";
  btn.textContent = "Actualizar Contacto";

  fetch(`${API_URL}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // La API responde en { code, message, data }.
      const c = data.data;
      document.getElementById("name").value = c.name;
      document.getElementById("phone").value = c.phone;
      document.getElementById("email").value = c.email;
      imgLinkInput.value = c.img_link || "";
      refreshPreview(c.img_link || "");
    })
    .catch((error) => {
      console.log("Error GET /contacts/:id:", error);
      alert("Error al cargar contacto");
    });
}

// Submit del formulario
// POST /contacts (crear)
// PUT /contacts/:id (editar)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  // Limpia alertas previas antes de validar/enviar.
  alertBox.innerHTML = "";

  // Normaliza entradas para evitar espacios/capitalización inconsistentes.
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const img_link = imgLinkInput.value.trim();

  // Validaciones básicas en frontend
  if (name.length < 2 || name.length > 60) {
    alertBox.innerHTML = `<div class="alert alert-warning">Nombre inválido (2 a 60 caracteres).</div>`;
    return;
  }

  if (!/^\d{8,15}$/.test(phone)) {
    alertBox.innerHTML = `<div class="alert alert-warning">Teléfono inválido (solo números, 8 a 15 dígitos).</div>`;
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alertBox.innerHTML = `<div class="alert alert-warning">Correo inválido.</div>`;
    return;
  }

  if (!isValidImageUrl(img_link)) {
    alertBox.innerHTML = `<div class="alert alert-warning">El link de imagen debe ser una URL válida (http/https).</div>`;
    return;
  }

  // El backend realiza validaciones definitivas; este payload refleja el formulario.
  const payload = { name, phone, email, img_link };

  // Reutiliza un único bloque para crear o actualizar según haya id.
  const config = {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };

  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, config)
    .then((response) => response.json())
    .then((data) => {
      if (data.code !== 1) {
        // Si hay varios errores de validación del backend, se muestran en líneas separadas.
        const msg = data.errors ? data.errors.join("<​br>") : data.message;
        alertBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
        return;
      }

      alertBox.innerHTML = `<div class="alert alert-success">${data.message}</div>`;

      // Breve pausa para que el usuario vea el mensaje de éxito.
      setTimeout(function () {
        window.location.href = "index.html";
      }, 700);
    })
    .catch((error) => {
      console.log("Error POST/PUT:", error);
      alertBox.innerHTML = `<div class="alert alert-danger">Error de conexión con el servidor.</div>`;
    });
});