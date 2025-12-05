/* =========================================================
   CONFIGURACIÓN GENERAL
========================================================= */

// Año en footer
document.getElementById("year").textContent = new Date().getFullYear();

// FRONT → BACKEND
const USE_LOCAL_API = true;
const API_BASE_URL = "http://localhost:3000";

async function fetchFromAPI(endpoint) {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error API " + res.status);
  return res.json();
}

/* =========================================================
   LANDING PAGE → MOSTRAR SITIO
========================================================= */
const enterBtn = document.getElementById("enter-site");
const landing = document.querySelector(".landing");
const header = document.querySelector(".site-header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const globalBar = document.querySelector(".global-category-bar");

if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    landing.classList.add("hidden");
    header.classList.remove("hidden");
    main.classList.remove("hidden");
    footer.classList.remove("hidden");
    globalBar.classList.remove("hidden");
  });
}

/* =========================================================
   MODO CLARO / OSCURO
========================================================= */
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
  });
}

/* =========================================================
   SELECTOR GLOBAL DE CATEGORÍAS
========================================================= */
const globalCatButtons = [...document.querySelectorAll(".global-cat-chip")];
let currentCategory = "Primera";

globalCatButtons.forEach(btn =>
  btn.addEventListener("click", () => setCategory(btn.dataset.category))
);

function setCategory(cat) {
  currentCategory = cat;
  globalCatButtons.forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.global-cat-chip[data-category="${cat}"]`);
  if (btn) btn.classList.add("active");

  updateCategoryData(cat);
}

/* =========================================================
   LOGOS DE CLUBES (fallback local)
========================================================= */
const staticTeamLogos = {
  "Funebrero": "img/logo-funebrero.png",
  "Bermejo": "img/logo-bermejo.png",
  "Unión": "img/logo-union.png",
  "Palermo": "img/logo-palermo.png"
};

let clubsCache = null;

function getTeamLogo(team) {
  if (clubsCache) {
    const c = clubsCache.find(c => c.nombre === team);
    if (c && c.logo) return c.logo;
  }
  return staticTeamLogos[team] || null;
}

/* =========================================================
   NOTICIAS (LOCAL)
========================================================= */
let newsData = [
  {
    title: "Bienvenidos a la nueva era del básquet NEA",
    body: "La ABNECH lanza su nueva plataforma moderna con resultados, fixtures y más."
  }
];

const newsGrid = document.getElementById("news-grid");

function renderNews() {
  if (!newsGrid) return;
  newsGrid.innerHTML = "";

  newsData.forEach(n => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <h3>${n.title}</h3>
      <p>${n.body}</p>
    `;
    newsGrid.appendChild(card);
  });
}

/* =========================================================
   CLUBES (desde API)
========================================================= */

async function loadClubs() {
  if (!USE_LOCAL_API) return [];
  try {
    const clubs = await fetchFromAPI("/api/clubs");
    clubsCache = clubs;
    return clubs;
  } catch (e) {
    console.error("Error cargando clubs, usando estáticos:", e);
    // fallback básico
    clubsCache = [
      { id: 1, nombre: "Funebrero", ciudad: "Las Palmas", logo: "img/logo-funebrero.png" },
      { id: 2, nombre: "Bermejo", ciudad: "Pto Bermejo", logo: "img/logo-bermejo.png" },
      { id: 3, nombre: "Unión", ciudad: "La Leonesa", logo: "img/logo-union.png" },
      { id: 4, nombre: "Palermo", ciudad: "Las Palmas", logo: "img/logo-palermo.png" }
    ];
    return clubsCache;
  }
}

async function renderClubes() {
  const grid = document.getElementById("club-grid");
  if (!grid) return;

  grid.innerHTML = "<p>Cargando clubes...</p>";

  const clubs = await loadClubs();

  grid.innerHTML = "";
  clubs.forEach(c => {
    const card = document.createElement("div");
    card.className = "club-card";

    card.innerHTML = `
      <img src="${c.logo || ''}" class="club-logo" alt="${c.nombre}">
      <h3>${c.nombre}</h3>
      <p>${c.ciudad || ''}</p>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   JUGADORES — desde API
========================================================= */

let playersCache = null;

async function loadPlayers() {
  if (!USE_LOCAL_API) {
    return [];
  }
  try {
    const players = await fetchFromAPI("/api/players");
    playersCache = players;
    return players;
  } catch (e) {
    console.error("Error cargando players, usando demo:", e);
    playersCache = [
      {
        id: 1,
        nombre: "Jugador Demo",
        equipo: "Funebrero",
        foto: "img/player-demo.jpg",
        ppg: 22.3,
        apg: 4.1,
        rpg: 6.7,
        spg: 1.9,
        fg: 48.5,
        eff: 27.4
      }
    ];
    return playersCache;
  }
}

async function renderPlayers() {
  const grid = document.getElementById("player-grid");
  if (!grid) return;

  grid.innerHTML = "<p>Cargando jugadores...</p>";

  const players = await loadPlayers();

  grid.innerHTML = "";
  players.forEach(p => {
    const card = document.createElement("div");
    card.className = "player-card";

    card.innerHTML = `
      <img src="${p.foto || 'img/player-demo.jpg'}" class="player-photo" alt="${p.nombre}">
      <h3 class="player-name">${p.nombre}</h3>
      <p>${p.equipo || ''}</p>
      <div class="player-stats">
        PPG: ${p.ppg ?? '-'} &nbsp;|&nbsp; APG: ${p.apg ?? '-'} &nbsp;|&nbsp; RPG: ${p.rpg ?? '-'}<br>
        SPG: ${p.spg ?? '-'} &nbsp;|&nbsp; FG%: ${p.fg ?? '-'} &nbsp;|&nbsp; EFF: ${p.eff ?? '-'}
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   GALERÍA Y SPONSORS (DEMOS)
========================================================= */
const galleryData = [
  { img: "img/gallery1.jpg" },
  { img: "img/gallery2.jpg" }
];

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  grid.innerHTML = "";
  galleryData.forEach(g => {
    const item = document.createElement("img");
    item.src = g.img;
    item.className = "gallery-item";
    grid.appendChild(item);
  });
}

const sponsorData = [
  { img: "img/sponsor1.png" },
  { img: "img/sponsor2.png" }
];

function renderSponsors() {
  const grid = document.getElementById("sponsor-grid");
  if (!grid) return;

  grid.innerHTML = "";
  sponsorData.forEach(s => {
    const card = document.createElement("div");
    card.className = "sponsor-card";
    card.innerHTML = `<img src="${s.img}" class="sponsor-logo">`;
    grid.appendChild(card);
  });
}

/* =========================================================
   FIXTURE / RESULTADOS / TABLAS
========================================================= */
const fixtureCache = {};
const standingsData = [
  { categoria: "Primera", equipo: "Bermejo", pj: 10, pg: 8, pp: 2, pts: 18, dif: 80, racha: "G2" },
  { categoria: "Primera", equipo: "Unión", pj: 10, pg: 7, pp: 3, pts: 17, dif: 45, racha: "L1" }
];

const fixtureGrid = document.getElementById("fixture-grid");
const resultsGrid = document.getElementById("results-grid");
const standingsTable = document.getElementById("standings-table");

function formatScore(s) {
  return s == null ? "--" : s;
}

function formatPct(pg, pj) {
  if (!pj) return ".000";
  const v = (pg / pj).toFixed(3);
  return v.startsWith("0") ? v.slice(1) : v;
}

async function loadFixture(cat) {
  if (fixtureCache[cat]) return fixtureCache[cat];

  let partidos = [];
  if (USE_LOCAL_API) {
    try {
      partidos = await fetchFromAPI(`/api/fixture?categoria=${encodeURIComponent(cat)}`);
    } catch (e) {
      console.error("Error API fixture:", e);
      partidos = [];
    }
  }
  fixtureCache[cat] = partidos;
  return partidos;
}

/* ---------- Render FIXTURE ---------- */
async function renderFixture(cat) {
  if (!fixtureGrid) return;
  fixtureGrid.innerHTML = "<p>Cargando fixture...</p>";

  const partidos = await loadFixture(cat);

  if (!partidos.length) {
    fixtureGrid.innerHTML = "<p>No hay partidos en esta categoría.</p>";
    return;
  }

  fixtureGrid.innerHTML = "";

  partidos.forEach((p, i) => {
    const L = getTeamLogo(p.local);
    const V = getTeamLogo(p.visitante);

    const card = document.createElement("article");
    card.className = "match-card";

    card.innerHTML = `
      <div class="match-header">
        <span>${p.jornada} - ${p.fechaTexto}</span>
      </div>

      <div class="match-body">
        <div class="team team-home">
          <div class="team-row">
            ${L ? `<img src="${L}" class="team-logo">` : ""}
            <span class="team-name">${p.local}</span>
          </div>
        </div>

        <div class="scoreboard">
          <span class="score">${formatScore(p.scoreLocal)}</span>
          <span class="score-separator">-</span>
          <span class="score">${formatScore(p.scoreVisitante)}</span>
        </div>

        <div class="team team-away">
          <div class="team-row">
            <span class="team-name">${p.visitante}</span>
            ${V ? `<img src="${V}" class="team-logo">` : ""}
          </div>
        </div>
      </div>

      <div class="match-footer">
        <span>${p.cancha || ""}</span>
        <a href="${p.planillaUrl || "#"}" class="planilla-btn">Ver planilla</a>
      </div>
    `;

    fixtureGrid.appendChild(card);
    setTimeout(() => card.classList.add("visible"), 40 * i);
  });
}

/* ---------- Render RESULTADOS ---------- */
async function renderResults(cat) {
  if (!resultsGrid) return;
  resultsGrid.innerHTML = "<p>Cargando resultados...</p>";

  const partidos = await loadFixture(cat);
  const finalizados = partidos.filter(p => p.estado === "Finalizado");

  if (!finalizados.length) {
    resultsGrid.innerHTML = "<p>No hay resultados finalizados.</p>";
    return;
  }

  resultsGrid.innerHTML = "";

  finalizados.forEach(p => {
    const L = getTeamLogo(p.local);
    const V = getTeamLogo(p.visitante);

    const card = document.createElement("article");
    card.className = "result-card";

    card.innerHTML = `
      <div class="result-header">
        <span>${p.jornada} • ${p.categoria}</span>
        <span>${p.fechaTexto}</span>
      </div>

      <div class="result-main">
        <div class="result-team result-team-home">
          ${L ? `<img src="${L}" class="result-logo">` : ""}
          <span class="result-team-name">${p.local}</span>
          <span class="result-score">${formatScore(p.scoreLocal)}</span>
        </div>

        <span class="result-tag-final">${p.estado ? p.estado.toUpperCase() : "FINAL"}</span>

        <div class="result-team result-team-away">
          <span class="result-score">${formatScore(p.scoreVisitante)}</span>
          <span class="result-team-name">${p.visitante}</span>
          ${V ? `<img src="${V}" class="result-logo">` : ""}
        </div>
      </div>

      <div class="result-footer">
        <span>${p.cancha || ""}</span>
        <a href="${p.planillaUrl || "#"}" class="result-link">Planilla</a>
      </div>
    `;

    resultsGrid.appendChild(card);
  });
}

/* ---------- Render TABLAS ---------- */
function renderStandings(cat) {
  if (!standingsTable) return;

  const rows = standingsData
    .filter(r => r.categoria === cat)
    .sort((a, b) => b.pts - a.pts || b.dif - a.dif);

  let html = `
    <thead>
      <tr>
        <th>#</th>
        <th class="stand-team">Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PP</th>
        <th>DIF</th>
        <th>PTS</th>
        <th>%</th>
        <th>Racha</th>
      </tr>
    </thead>
    <tbody>
  `;

  rows.forEach((r, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td class="stand-team">${r.equipo}</td>
        <td>${r.pj}</td>
        <td>${r.pg}</td>
        <td>${r.pp}</td>
        <td>${r.dif > 0 ? "+" + r.dif : r.dif}</td>
        <td>${r.pts}</td>
        <td>${formatPct(r.pg, r.pj)}</td>
        <td>${r.racha}</td>
      </tr>
    `;
  });

  html += "</tbody>";
  standingsTable.innerHTML = html;
}

/* =========================================================
   CAMBIO DE CATEGORÍA
========================================================= */
async function updateCategoryData(cat) {
  await renderFixture(cat);
  await renderResults(cat);
  renderStandings(cat);
}

/* =========================================================
   INICIALIZACIÓN
========================================================= */
renderNews();
renderGallery();
renderSponsors();
renderClubes();
renderPlayers();
setCategory("Primera");
