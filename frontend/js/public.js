import { getFixtures } from "./services/fixtures.service.js";
import { getStandings } from "./services/standings.service.js";

/* =========================
   MAPA DE CLUBES (FIJO)
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
  const fixtureGrid = document.getElementById("fixture-grid");

  if (!fixtureGrid) return;

  fixtureGrid.innerHTML = "";

  fixtures.forEach((fixture) => {
    const home = CLUBS_MAP[fixture.homeClubId];
    const away = CLUBS_MAP[fixture.awayClubId];

    if (!home || !away) return;

    fixtureGrid.innerHTML += `
      <div class="fixture-card">
        <div class="fixture-teams">
          <span>${home.name}</span>
          <span class="fixture-vs">VS</span>
          <span>${away.name}</span>
        </div>
        <div class="fixture-info">
          ${fixture.scoreLocal} - ${fixture.scoreAway}
        </div>
      </div>
    `;
  });
}

async function loadFixtures() {
  try {
    const fixtures = await getFixtures("B1");
    renderFixtures(fixtures);
  } catch (err) {
    console.error("Error cargando fixture", err);
  }
}

/* =========================
   TABLA DE POSICIONES
========================= */
function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  standings.forEach((team, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
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
    const standings = await getStandings("B1");
    renderStandings(standings);
  } catch (err) {
    console.error("Error cargando standings", err);
  }
}

/* =========================
   INIT PUBLIC PAGE
========================= */
export function initPublicPage() {
  loadFixtures();
  loadStandings();
}
