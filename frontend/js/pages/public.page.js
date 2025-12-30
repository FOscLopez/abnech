import { getStandings } from "../services/standings.service.js";
import { getFixturesByCategory } from "../services/fixtures.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  // STANDINGS
  try {
    const standings = await getStandings();
    renderStandings(standings);
  } catch (err) {
    console.error("Error cargando standings:", err.message);
  }

  // FIXTURE
  try {
    const fixtures = await getFixturesByCategory("B1");
    renderFixtures(fixtures);
  } catch (err) {
    console.error("Error cargando fixture:", err.message);
  }
}

/* =========================
   FIXTURE
========================= */

function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");

  if (!grid) {
    console.warn("No existe #fixture-grid en el HTML");
    return;
  }

  grid.innerHTML = "";

  if (!fixtures || fixtures.length === 0) {
    grid.innerHTML = "<p>No hay partidos cargados</p>";
    return;
  }

  fixtures.forEach(f => {
    const card = document.createElement("div");
    card.className = "fixture-card";

    card.innerHTML = `
      <div class="fixture-info">
        <div>${f.date} - ${f.time}</div>
        <div>${f.venue}</div>
      </div>

      <div class="fixture-teams">
        <span>${f.homeClubId}</span>
        <span class="fixture-vs">vs</span>
        <span>${f.awayClubId}</span>
      </div>

      <div class="fixture-info">
        ${f.status === "finished"
          ? `<strong>${f.scoreLocal} - ${f.scoreAway}</strong>`
          : `<span>Próximo partido</span>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   STANDINGS
========================= */

function renderStandings(standings) {
  const tableBody = document.getElementById("standingsBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  standings.forEach((t, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${t.name}</td>
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
