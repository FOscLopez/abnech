/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

// Año en footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// URL del backend (Render)
const API_BASE_URL = "https://abnech.onrender.com";

/**
 * Helper para consumir la API del backend
 */
async function fetchFromAPI(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error API ${res.status}: ${url}`);
  return res.json();
}

/**
 * Helper para armar URLs de imágenes / planillas
 * - Si ya es absoluta (http/https) → la deja
 * - Si empieza con /uploads → la pega a API_BASE_URL
 * - Si es relativa (img/...) → se sirve desde Firebase (frontend)
 */
function resolveMediaUrl(path) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return `${API_BASE_URL}${path}`;
  }

  return path; // ej: img/logo-fune.png
}

/* =========================================================
   LANDING / INICIO
========================================================= */

const landingSection = document.querySelector(".landing");
const enterBtn = document.getElementById("enter-site");
const siteHeader = document.querySelector(".site-header");
const globalCatBar = document.querySelector(".global-category-bar");
const mainEl = document.querySelector("main");
const footerEl = document.querySelector(".site-footer");

if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    if (landingSection) landingSection.classList.add("hidden");
    if (siteHeader) siteHeader.classList.remove("hidden");
    if (globalCatBar) globalCatBar.classList.remove("hidden");
    if (mainEl) mainEl.classList.remove("hidden");
    if (footerEl) footerEl.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   THEME TOGGLE (oscuro / claro)
========================================================= */

const themeToggleBtn = document.getElementById("theme-toggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    themeToggleBtn.textContent = next === "dark" ? "🌙" : "☀️";
  });
}

/* =========================================================
   SELECTOR GLOBAL DE CATEGORÍAS
========================================================= */

let currentCategory = "Primera";
const categoryButtons = Array.from(
  document.querySelectorAll(".global-cat-chip")
);
const fixtureGrid = document.getElementById("fixture-grid");
const resultsGrid = document.getElementById("results-grid");
const standingsTable = document.getElementById("standings-table");

// Cache simple para no llamar siempre a la API
const fixtureCache = {};

async function updateCategoryData(category) {
  currentCategory = category;

  // Marcar chip activo
  categoryButtons.forEach((btn) =>
    btn.classList.toggle(
      "active",
      btn.dataset.category === currentCategory
    )
  );

  await Promise.all([
    renderFixture(currentCategory),
    renderResults(currentCategory),
    renderStandings(currentCategory)
  ]);
}

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.category;
    updateCategoryData(cat);
  });
});

/* =========================================================
   NOTICIAS (mock local)
========================================================= */

const newsGrid = document.getElementById("news-grid");

let newsData = [
  {
    title: "Bienvenidos a la nueva era del básquet NEA",
    body: "La ABNECH lanza su nueva plataforma moderna con resultados, fixtures y más."
  }
];

function renderNews() {
  if (!newsGrid) return;
  newsGrid.innerHTML = "";

  newsData.forEach((item) => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    `;
    newsGrid.appendChild(card);
  });
}

/* =========================================================
   FIXTURE
========================================================= */

async function getFixtureByCategory(category) {
  if (fixtureCache[category]) return fixtureCache[category];
  const data = await fetchFromAPI(`/api/fixture?categoria=${encodeURIComponent(category)}`);
  fixtureCache[category] = data;
  return data;
}

function buildTeamRow(name, city) {
  return `
    <div class="team-row">
      <div class="team-info">
        <span class="team-name">${name}</span>
        <span class="team-city">${city || ""}</span>
      </div>
    </div>
  `;
}

async function renderFixture(category) {
  if (!fixtureGrid) return;

  try {
    const partidos = await getFixtureByCategory(category);
    fixtureGrid.innerHTML = "";

    if (!partidos.length) {
      fixtureGrid.innerHTML = "<p>No hay partidos programados para esta categoría.</p>";
      return;
    }

    partidos
      .filter((p) => p.estado !== "Finalizado")
      .forEach((p) => {
        const planillaUrl = resolveMediaUrl(p.planillaUrl) || "#";

        const card = document.createElement("article");
        card.className = "match-card";
        card.innerHTML = `
          <div class="match-header">
            <span class="match-jornada">${p.jornada || ""}</span>
            <span class="match-fecha">${p.fechaTexto || ""}</span>
          </div>

          <div class="match-body">
            ${buildTeamRow(p.local, p.ciudadLocal)}
            <div class="scoreboard pending">
              <span class="score-label">${p.estado || "Programado"}</span>
            </div>
            ${buildTeamRow(p.visitante, p.ciudadVisitante)}
          </div>

          <div class="match-footer">
            <span class="match-cancha">${p.cancha || ""}</span>
            ${
              p.planillaUrl
                ? `<a href="${planillaUrl}" target="_blank" class="sheet-link">Ver planilla</a>`
                : ""
            }
          </div>
        `;
        fixtureGrid.appendChild(card);

        // animación
        requestAnimationFrame(() => card.classList.add("visible"));
      });
  } catch (err) {
    console.error("Error renderFixture:", err);
    fixtureGrid.innerHTML = "<p>Error cargando fixture.</p>";
  }
}

/* =========================================================
   RESULTADOS
========================================================= */

async function renderResults(category) {
  if (!resultsGrid) return;

  try {
    const partidos = await getFixtureByCategory(category);
    resultsGrid.innerHTML = "";

    const finalizados = partidos.filter((p) => p.estado === "Finalizado");

    if (!finalizados.length) {
      resultsGrid.innerHTML = "<p>No hay resultados finalizados para esta categoría.</p>";
      return;
    }

    finalizados.forEach((p) => {
      const planillaUrl = resolveMediaUrl(p.planillaUrl) || "#";
      const card = document.createElement("article");
      card.className = "result-card";
      card.innerHTML = `
        <div class="result-header">
          <span class="result-jornada">${p.jornada || ""}</span>
          <span class="result-fecha">${p.fechaTexto || ""}</span>
        </div>

        <div class="result-main">
          <div class="result-team">
            <span class="team-name">${p.local}</span>
            <span class="team-city">${p.ciudadLocal || ""}</span>
          </div>

          <div class="result-score">
            <span class="score">${p.scoreLocal ?? "-"}</span>
            <span class="result-vs">-</span>
            <span class="score">${p.scoreVisitante ?? "-"}</span>
          </div>

          <div class="result-team">
            <span class="team-name">${p.visitante}</span>
            <span class="team-city">${p.ciudadVisitante || ""}</span>
          </div>
        </div>

        <div class="result-footer">
          <span class="result-status">${p.estado || "Finalizado"}</span>
          ${
            p.planillaUrl
              ? `<a href="${planillaUrl}" target="_blank" class="sheet-link">Planilla</a>`
              : ""
          }
        </div>
      `;
      resultsGrid.appendChild(card);
    });
  } catch (err) {
    console.error("Error renderResults:", err);
    resultsGrid.innerHTML = "<p>Error cargando resultados.</p>";
  }
}

/* =========================================================
   TABLAS DE POSICIONES (calculadas simple desde fixture)
========================================================= */

function computeStandings(partidos) {
  const tabla = {};

  partidos.forEach((p) => {
    if (p.estado !== "Finalizado") return;
    if (typeof p.scoreLocal !== "number" || typeof p.scoreVisitante !== "number") return;

    if (!tabla[p.local]) {
      tabla[p.local] = { equipo: p.local, pj: 0, pg: 0, pp: 0, pts: 0, dif: 0 };
    }
    if (!tabla[p.visitante]) {
      tabla[p.visitante] = { equipo: p.visitante, pj: 0, pg: 0, pp: 0, pts: 0, dif: 0 };
    }

    const local = tabla[p.local];
    const vis = tabla[p.visitante];

    local.pj++;
    vis.pj++;

    const difLocal = p.scoreLocal - p.scoreVisitante;
    const difVis = -difLocal;

    local.dif += difLocal;
    vis.dif += difVis;

    if (p.scoreLocal > p.scoreVisitante) {
      local.pg++; vis.pp++;
    } else if (p.scoreLocal < p.scoreVisitante) {
      vis.pg++; local.pp++;
    }

    local.pts = local.pg * 2 + local.pp;
    vis.pts = vis.pg * 2 + vis.pp;
  });

  return Object.values(tabla).sort((a, b) => b.pts - a.pts || b.dif - a.dif);
}

async function renderStandings(category) {
  if (!standingsTable) return;

  try {
    const partidos = await getFixtureByCategory(category);
    const tabla = computeStandings(partidos);

    if (!tabla.length) {
      standingsTable.innerHTML = "<tr><td>No hay datos para la tabla.</td></tr>";
      return;
    }

    let html = `
      <thead>
        <tr>
          <th>#</th>
          <th>Equipo</th>
          <th>PJ</th>
          <th>PG</th>
          <th>PP</th>
          <th>DIF</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>
    `;

    tabla.forEach((t, index) => {
      html += `
        <tr>
          <td>${index + 1}</td>
          <td>${t.equipo}</td>
          <td>${t.pj}</td>
          <td>${t.pg}</td>
          <td>${t.pp}</td>
          <td>${t.dif > 0 ? "+" + t.dif : t.dif}</td>
          <td>${t.pts}</td>
        </tr>
      `;
    });

    html += "</tbody>";
    standingsTable.innerHTML = html;
  } catch (err) {
    console.error("Error renderStandings:", err);
    standingsTable.innerHTML = "<tr><td>Error cargando tabla.</td></tr>";
  }
}

/* =========================================================
   CLUBES
========================================================= */

const clubGrid = document.getElementById("club-grid");

async function renderClubes() {
  if (!clubGrid) return;

  try {
    const clubes = await fetchFromAPI("/api/clubs");
    clubGrid.innerHTML = "";

    if (!clubes.length) {
      clubGrid.innerHTML = "<p>No hay clubes cargados todavía.</p>";
      return;
    }

    clubes.forEach((club) => {
      const logoUrl =
        resolveMediaUrl(club.logo) || "img/club-placeholder.png";

      const card = document.createElement("article");
      card.className = "club-card";
      card.innerHTML = `
        <div class="club-logo-wrapper">
          <img
            src="${logoUrl}"
            alt="${club.nombre || "Club"}"
            class="club-logo"
            onerror="this.src='img/club-placeholder.png'"
          />
        </div>
        <h3>${club.nombre || "Club sin nombre"}</h3>
        <p>${club.ciudad || ""}</p>
      `;
      clubGrid.appendChild(card);
    });
  } catch (err) {
    console.error("Error renderClubes:", err);
    clubGrid.innerHTML = "<p>Error cargando clubes.</p>";
  }
}

/* =========================================================
   JUGADORES
========================================================= */

const playerGrid = document.getElementById("player-grid");

async function renderPlayers() {
  if (!playerGrid) return;

  try {
    const jugadores = await fetchFromAPI("/api/players");
    playerGrid.innerHTML = "";

    if (!jugadores.length) {
      playerGrid.innerHTML = "<p>No hay jugadores cargados todavía.</p>";
      return;
    }

    jugadores.forEach((j) => {
      const fotoUrl =
        resolveMediaUrl(j.foto) || "img/player-placeholder.png";

      const card = document.createElement("article");
      card.className = "player-card";
      card.innerHTML = `
        <img
          src="${fotoUrl}"
          alt="${j.nombre || "Jugador"}"
          class="player-photo"
          onerror="this.src='img/player-placeholder.png'"
        />
        <h3 class="player-name">${j.nombre || "Jugador"}</h3>
        <p class="player-team">${j.equipo || ""}</p>
        <div class="player-stats">
          <p><strong>PPG:</strong> ${j.ppg ?? "-"}</p>
          <p><strong>RPG:</strong> ${j.rpg ?? "-"}</p>
          <p><strong>APG:</strong> ${j.apg ?? "-"}</p>
          <p><strong>SPG:</strong> ${j.spg ?? "-"}</p>
          <p><strong>FG%:</strong> ${j.fg ?? "-"}</p>
          <p><strong>EFF:</strong> ${j.eff ?? "-"}</p>
        </div>
      `;
      playerGrid.appendChild(card);
    });
  } catch (err) {
    console.error("Error renderPlayers:", err);
    playerGrid.innerHTML = "<p>Error cargando jugadores.</p>";
  }
}

/* =========================================================
   GALERÍA / SPONSORS (mock simple)
========================================================= */

const galleryGrid = document.getElementById("gallery-grid");
const sponsorGrid = document.getElementById("sponsor-grid");

function renderGallery() {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = `
    <div class="gallery-item">Próximamente: galería de fotos oficiales.</div>
  `;
}

function renderSponsors() {
  if (!sponsorGrid) return;
  sponsorGrid.innerHTML = `
    <div class="sponsor-card">Sponsor 1</div>
    <div class="sponsor-card">Sponsor 2</div>
    <div class="sponsor-card">Sponsor 3</div>
  `;
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */

async function initSite() {
  try {
    renderNews();
    renderGallery();
    renderSponsors();
    await updateCategoryData(currentCategory);
    await renderClubes();
    await renderPlayers();
  } catch (err) {
    console.error("Error inicializando sitio:", err);
  }
}

// Solo inicializamos cuando ya estamos en la vista principal
// (por si el usuario todavía está en la landing)
document.addEventListener("DOMContentLoaded", () => {
  // Si la landing ya está oculta (por alguna razón), cargamos todo igual
  initSite();
});
