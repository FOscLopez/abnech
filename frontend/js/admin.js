// admin.js – Panel administrativo

const API_URL = (typeof API_BASE_URL !== "undefined")
  ? API_BASE_URL
  : "http://localhost:3000";

function toast(msg) {
  alert(msg);
}

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error ${res.status}: ${txt}`);
  }
  return res.json();
}

async function refreshCurrentCategory() {
  try {
    if (typeof fixtureCache !== "undefined" &&
        typeof currentCategory !== "undefined" &&
        typeof updateCategoryData === "function") {

      delete fixtureCache[currentCategory];
      await updateCategoryData(currentCategory);
    }
  } catch (e) {
    console.error("Error refrescando categoría:", e);
  }
}

async function refreshPlayers() {
  try {
    if (typeof renderPlayers === "function") {
      await renderPlayers();
    }
  } catch (e) {
    console.error("Error refrescando jugadores:", e);
  }
}

async function refreshClubs() {
  try {
    if (typeof renderClubes === "function") {
      await renderClubes();
    }
  } catch (e) {
    console.error("Error refrescando clubes:", e);
  }
}

// ======================================================
// PARTIDOS
// ======================================================

document.getElementById("create-match")?.addEventListener("click", async () => {
  try {
    const data = {
      categoria: document.getElementById("new-cat").value.trim(),
      jornada: document.getElementById("new-jornada").value.trim(),
      fechaTexto: document.getElementById("new-fecha").value.trim(),
      local: document.getElementById("new-local").value.trim(),
      visitante: document.getElementById("new-visitante").value.trim(),
      ciudadLocal: document.getElementById("new-ciudad-local").value.trim(),
      ciudadVisitante: document.getElementById("new-ciudad-visitante").value.trim(),
      estado: document.getElementById("new-estado").value,
      scoreLocal: null,
      scoreVisitante: null,
      cancha: document.getElementById("new-cancha").value.trim(),
      planillaUrl: "#"
    };

    if (!data.categoria || !data.jornada || !data.local || !data.visitante) {
      return toast("Completá categoría, jornada, local y visitante");
    }

    const partido = await safeFetch(`${API_URL}/api/fixture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    toast("Partido creado. ID: " + partido.id);
    await refreshCurrentCategory();
  } catch (e) {
    console.error(e);
    toast("Error al crear partido");
  }
});

document.getElementById("update-match")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("upd-id").value, 10);
    const scoreLocal = parseInt(document.getElementById("upd-score-local").value, 10);
    const scoreVisitante = parseInt(document.getElementById("upd-score-visitante").value, 10);
    const estado = document.getElementById("upd-estado").value;

    if (!id || Number.isNaN(id)) return toast("ID inválido");
    if (Number.isNaN(scoreLocal) || Number.isNaN(scoreVisitante)) {
      return toast("Ingresá los puntos de ambos equipos");
    }

    await safeFetch(`${API_URL}/api/fixture/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scoreLocal, scoreVisitante, estado })
    });

    toast("Partido actualizado");
    await refreshCurrentCategory();
  } catch (e) {
    console.error(e);
    toast("Error al actualizar partido");
  }
});

document.getElementById("delete-match")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("del-id").value, 10);
    if (!id || Number.isNaN(id)) return toast("ID inválido");

    if (!confirm(`¿Eliminar partido ID ${id}?`)) return;

    await safeFetch(`${API_URL}/api/fixture/${id}`, {
      method: "DELETE"
    });

    toast("Partido eliminado");
    await refreshCurrentCategory();
  } catch (e) {
    console.error(e);
    toast("Error al eliminar partido");
  }
});

document.getElementById("upload-planilla")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("planilla-id").value, 10);
    const fileInput = document.getElementById("planilla-file");
    const file = fileInput.files[0];

    if (!id || Number.isNaN(id)) return toast("ID inválido");
    if (!file) return toast("Seleccioná un archivo de planilla");

    const formData = new FormData();
    formData.append("planilla", file);

    await safeFetch(`${API_URL}/api/upload?id=${id}`, {
      method: "POST",
      body: formData
    });

    toast("Planilla subida y vinculada");
    fileInput.value = "";
    await refreshCurrentCategory();
  } catch (e) {
    console.error(e);
    toast("Error al subir planilla");
  }
});

// ======================================================
// NOTICIAS (FRONT LOCAL)
// ======================================================

document.getElementById("add-news")?.addEventListener("click", () => {
  try {
    const titleInput = document.getElementById("news-title");
    const bodyInput = document.getElementById("news-body");

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
      return toast("Completá título y contenido");
    }

    if (typeof newsData === "undefined" || typeof renderNews !== "function") {
      return toast("Noticias no disponibles");
    }

    newsData.unshift({ title, body });
    renderNews();

    titleInput.value = "";
    bodyInput.value = "";

    toast("Noticia publicada");
  } catch (e) {
    console.error(e);
    toast("Error al agregar noticia");
  }
});

// ======================================================
// JUGADORES
// ======================================================

document.getElementById("create-player")?.addEventListener("click", async () => {
  try {
    const nombre = document.getElementById("player-name").value.trim();
    const equipo = document.getElementById("player-team").value.trim();
    const foto = document.getElementById("player-photo").value.trim();

    const ppg = parseFloat(document.getElementById("player-ppg").value);
    const apg = parseFloat(document.getElementById("player-apg").value);
    const rpg = parseFloat(document.getElementById("player-rpg").value);
    const spg = parseFloat(document.getElementById("player-spg").value);
    const fg = parseFloat(document.getElementById("player-fg").value);
    const eff = parseFloat(document.getElementById("player-eff").value);

    if (!nombre || !equipo) {
      return toast("Completá al menos nombre y equipo");
    }

    const body = {
      nombre,
      equipo,
      foto: foto || null,
      ppg: isNaN(ppg) ? null : ppg,
      apg: isNaN(apg) ? null : apg,
      rpg: isNaN(rpg) ? null : rpg,
      spg: isNaN(spg) ? null : spg,
      fg: isNaN(fg) ? null : fg,
      eff: isNaN(eff) ? null : eff
    };

    const jugador = await safeFetch(`${API_URL}/api/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    toast("Jugador creado. ID: " + jugador.id);
    await refreshPlayers();
  } catch (e) {
    console.error(e);
    toast("Error al crear jugador");
  }
});

document.getElementById("delete-player")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("player-del-id").value, 10);
    if (!id || Number.isNaN(id)) {
      return toast("ID inválido para jugador");
    }

    if (!confirm(`¿Eliminar jugador ID ${id}?`)) return;

    await safeFetch(`${API_URL}/api/players/${id}`, {
      method: "DELETE"
    });

    toast("Jugador eliminado");
    await refreshPlayers();
  } catch (e) {
    console.error(e);
    toast("Error al eliminar jugador");
  }
});

// ======================================================
// CLUBES
// ======================================================

document.getElementById("create-club")?.addEventListener("click", async () => {
  try {
    const nombre = document.getElementById("club-name").value.trim();
    const ciudad = document.getElementById("club-city").value.trim();
    const logoUrl = document.getElementById("club-logo-url").value.trim();

    if (!nombre) return toast("Completá el nombre del club");

    const body = {
      nombre,
      ciudad,
      logo: logoUrl || null
    };

    const club = await safeFetch(`${API_URL}/api/clubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    toast("Club creado. ID: " + club.id);
    await refreshClubs();
  } catch (e) {
    console.error(e);
    toast("Error al crear club");
  }
});

document.getElementById("delete-club")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("club-del-id").value, 10);
    if (!id || Number.isNaN(id)) {
      return toast("ID inválido para club");
    }

    if (!confirm(`¿Eliminar club ID ${id}?`)) return;

    await safeFetch(`${API_URL}/api/clubs/${id}`, {
      method: "DELETE"
    });

    toast("Club eliminado");
    await refreshClubs();
  } catch (e) {
    console.error(e);
    toast("Error al eliminar club");
  }
});

document.getElementById("upload-club-logo")?.addEventListener("click", async () => {
  try {
    const id = parseInt(document.getElementById("club-logo-id").value, 10);
    const fileInput = document.getElementById("club-logo-file");
    const file = fileInput.files[0];

    if (!id || Number.isNaN(id)) return toast("ID inválido para club");
    if (!file) return toast("Seleccioná un archivo de logo");

    const formData = new FormData();
    formData.append("logo", file);

    await safeFetch(`${API_URL}/api/upload-club-logo?id=${id}`, {
      method: "POST",
      body: formData
    });

    toast("Logo de club subido");
    fileInput.value = "";
    await refreshClubs();
  } catch (e) {
    console.error(e);
    toast("Error al subir logo de club");
  }
});
