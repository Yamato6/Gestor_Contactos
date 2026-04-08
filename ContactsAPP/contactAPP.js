const API_URL = "http://localhost:3000/contacts";
// Guarda el id seleccionado para acciones de editar/eliminar.
let currentId = null;
// Caché en memoria de la lista mostrada para ordenamientos locales.
let contactosGlobal = [];

// GET /contacts
// Cargar contactos (con búsqueda opcional)
function cargarContactos(search = "") {
  // Cuando hay texto de búsqueda, se consulta al backend con query param.
  const url = search
    ? `${API_URL}?search=${encodeURIComponent(search)}`
    : API_URL;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Fallback seguro por si la API no trae el arreglo esperado.
      contactosGlobal = data.data || [];
      pintarLista(contactosGlobal);
    })
    .catch((error) => {
      console.log("Error GET /contacts:", error);
      alert("Error al cargar contactos");
    });
}

// Renderizar lista en pantalla
function pintarLista(contactos) {
  const lista = document.getElementById("contacts-list");
  const count = document.getElementById("contact-count");
  // Re-render completo de la lista actual.
  lista.innerHTML = "";

  if (contactos.length === 0) {
    lista.innerHTML = `<div class="text-center text-muted py-4">No hay contactos.</div>`;
    count.textContent = "(0)";
    return;
  }

  contactos.forEach((c) => {
    // Cada contacto se pinta como botón para facilitar selección rápida.
    const item = document.createElement("button");
    item.className = "list-group-item list-group-item-action";
    item.innerHTML = `<strong>${c.name}</strong><br><small>${c.email}</small>`;
    item.onclick = function () {
      verDetalle(c.id);
    };
    lista.appendChild(item);
  });

  count.textContent = `(${contactos.length})`;
}

// GET /contacts/:id
// Ver detalle de un contacto
function verDetalle(id) {
  fetch(`${API_URL}/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const c = data.data;
      // Se conserva el seleccionado para editar/eliminar luego.
      currentId = c.id;

      document.getElementById("no-selection").classList.add("d-none");
      document.getElementById("contact-detail").classList.remove("d-none");

      document.getElementById("detail-name").textContent = c.name;
      document.getElementById("detail-phone").textContent = c.phone;
      document.getElementById("detail-email").textContent = c.email;
      document.getElementById("detail-id").textContent = "ID: " + c.id;

      const avatarImage = document.getElementById("detail-avatar-image");
      const avatarFallback = document.getElementById("detail-avatar-fallback");

      // Avatar con iniciales
      const iniciales = c.name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      // Normaliza el campo para evitar espacios que aparenten URL valida.
      const imageUrl = typeof c.img_link === "string" ? c.img_link.trim() : "";

      if (imageUrl) {
        // Si la imagen falla al cargar, vuelve automaticamente al avatar por iniciales.
        avatarImage.onerror = function () {
          avatarImage.removeAttribute("src");
          avatarImage.style.display = "none";
          avatarFallback.style.display = "flex";
          avatarFallback.textContent = iniciales;
        };

        // Prioriza imagen cuando existe un link valido.
        avatarImage.src = imageUrl;
        avatarImage.style.display = "block";
        avatarFallback.style.display = "none";
      } else {
        // Sin imagen, usa el fallback de iniciales.
        avatarImage.removeAttribute("src");
        avatarImage.onerror = null;
        avatarImage.style.display = "none";
        avatarFallback.style.display = "flex";
        avatarFallback.textContent = iniciales;
      }
    })
    .catch((error) => {
      console.log("Error GET /contacts/:id:", error);
      alert("Error al obtener detalle");
    });
}

// DELETE /contacts/:id
// Eliminar contacto seleccionado
function eliminarActual() {
  // Si no hay selección activa, no intenta borrar.
  if (!currentId) return;
  // Confirmación explícita para evitar borrados accidentales.
  if (!confirm("¿Eliminar contacto?")) return;

  fetch(`${API_URL}/${currentId}`, {
    method: "DELETE"
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      currentId = null;

      document.getElementById("contact-detail").classList.add("d-none");
      document.getElementById("no-selection").classList.remove("d-none");

      cargarContactos(document.getElementById("search-input").value.trim());
    })
    .catch((error) => {
      console.log("Error DELETE /contacts/:id:", error);
      alert("Error al eliminar contacto");
    });
}

// Ordenar contactos A-Z (lado cliente)
function ordenarAZ() {
  // Ordena en cliente sobre la lista actualmente cargada.
  contactosGlobal.sort((a, b) => a.name.localeCompare(b.name));
  pintarLista(contactosGlobal);
}

// Eventos de interfaz
document.getElementById("search-input").addEventListener("input", function () {
  // Búsqueda reactiva mientras el usuario escribe.
  cargarContactos(this.value.trim());
});

document.getElementById("btn-sort-az").addEventListener("click", ordenarAZ);

document.getElementById("btn-new-contact").addEventListener("click", function () {
  window.location.href = "form.html";
});

document.getElementById("btn-edit-contact").addEventListener("click", function () {
  // Solo permite editar si existe un contacto seleccionado.
  if (!currentId) return;
  window.location.href = `form.html?id=${currentId}`;
});

document.getElementById("btn-delete-contact").addEventListener("click", eliminarActual);

// Inicio de la app
cargarContactos();