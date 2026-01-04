import { getStandings } from "../services/standings.service.js";
import { getFixturesByCategory } from "../services/fixtures.service.js";

/* =========================
   MAPA DE LOGOS
========================= */
const CLUB_LOGOS = {
  union: "union.png",
  funebrero: "cfa.png",
  "general-vedia": "general-vedia.png",
  "la-leonesa": "la-leonesa.png",
  palermo: "palermo.png",
  "palermo-cap": "palermo-cap.png",
  "puerto-bermejo": "puerto-bermejo.png",
  zapallar: "zapallar.png"
};

const CLUBS_PATH = "./img/clubs/";

export async function initPublicPage() {
  console.log("Public page init");

  try {
    const standings = await getStandings();
    renderStandings(standings);
  } catch (err) {
    console.error("Error cargando standings:", err.message);
  }

  try {
    const fixtures = await getFixturesByCategory("B1");
    renderFixtures(fixtures);
  } catch (err) {
    console.error("Error cargando fixtures:", err.message);
  }
}

/* =========================
   FIXTURE (SIN CAMBIOS)
========================= */

function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  fixtures.forEach(f => {
    const card = document.createElement("div");
    card.className = "fixture-card";

    card.innerHTML = `
      <div class="fixture-info">${f.date} · ${f.time}</div>

      <div class="fixture-teams">
        <img src="${CLUBS_PATH}${CLUB_LOGOS[f.homeClubId]}" height="48" />
        <span class="fixture-vs">VS</span>
        <img src="${CLUBS_PATH}${CLUB_LOGOS[f.awayClubId]}" height="48" />
      </div>

      <div class="fixture-info">${f.venue}</div>
      <div class="fixture-info"><strong>${f.scoreLocal} - ${f.scoreAway}</strong></div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   TABLA CON LOGOS (PASO NUEVO)
========================= */

function renderStandings(standings) {
  const tableBody = document.getElementById("standingsBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  standings.forEach((t, index) => {
    const tr = document.createElement("tr");

    const logo = CLUB_LOGOS[t.id];

    tr.innerHTML = `
      <td>${index + 1}</td>

      <td style="display:flex; align-items:center; gap:8px;">
        ${
          logo
            ? `<img src="${CLUBS_PATH}${logo}" height="24" />`
            : ""
        }
        <span>${t.name}</span>
      </td>

      <td>${t.PJ}</td>
      <td>${t.PG}</td>
      <td>${t.PP}</td>
      <td>${t.PF}</td>
      <td>${t.PC}</td>
      <td>${t.DG}</td>
      <td>${t.PTS}</td>
    `;

    tableBody.appendChild(tr);
  });
}
