import { getFixtures } from "./services/fixtures.service.js";
import { getStandings } from "./services/standings.service.js";

/* =========================
   MAPA DE CLUBES
========================= */
const CLUBS_MAP = {
  union: { name: "Unión", logo: "/img/clubs/union.png" },
  funebrero: { name: "Funebrero", logo: "/img/clubs/palermo.png" },
  cfa: { name: "CFA", logo: "/img/clubs/cfa.png" },
  "general-vedia": { name: "General Vedia", logo: "/img/clubs/general-vedia.png" },
  "la-leonesa": { name: "La Leonesa", logo: "/img/clubs/la-leonesa.png" },
  "palermo-cap": { name: "Palermo CAP", logo: "/img/clubs/palermo-cap.png" },
  "puerto-bermejo": { name: "Puerto Bermejo", logo: "/img/clubs/puerto-bermejo.png" },
  zapallar: { name: "Zapallar", logo: "/img/clubs/zapallar.png" },
};

/* =========================
   FIXTURE
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  fixtures.forEach((f) => {
    const home = CLUBS_MAP[f.homeClubId];
    const away = CLUBS_MAP[f.awayClubId];
    if (!home || !away) return;

    grid.innerHTML += `
      <div class="fixture-card">
        <div class="fixture-teams">
          <span>${home.name}</span>
          <span class="fixture-vs">VS</span>
          <span>${away.name}</span>
        </div>
        <div class="fixture-info">
          ${f.scoreLocal} - ${f.scoreAway}
        </div>
      </div>
    `;
  });
}

async function loadFixtures() {
  try {
    const fixtures = await getFixtures("B1");
    renderFixtures(fixtures);
  } catch (e) {
    console.error("Error cargando fixture", e);
  }
}

/* =========================
   TABLA DE POSICIONES
========================= */
function renderStandings(list) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  list.forEach((team, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${team.name}</td>
        <td>${team.PJ}</td>
        <td>${team.PG}</td>
        <td>${team.PP}</td>
        <td>${team.PF}</td>
        <td>${team.PC}</td>
        <td>${team.DG}</td>
        <td>${team.PTS}</td>
      </tr>
    `;
  });
}

async function loadStandings() {
  try {
    const response = await getStandings("B1");

    // 🔴 CLAVE: soporta ambos formatos
    const standings = Array.isArray(response)
      ? response
      : response.standings || [];

    renderStandings(standings);
  } catch (e) {
    console.error("Error cargando tabla", e);
  }
}

/* =========================
   INIT
========================= */
export function initPublicPage() {
  loadFixtures();
  loadStandings();
}
