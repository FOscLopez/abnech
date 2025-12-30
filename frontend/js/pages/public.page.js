import { getStandings } from "../services/standings.service.js";
import { getFixturesByCategory } from "../services/fixtures.service.js";

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

/* ================= TABLA ================= */

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

/* ================= FIXTURE ================= */

function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");

  if (!grid) {
    console.warn("No existe #fixture-grid en el HTML");
    return;
  }

  grid.innerHTML = "";

  fixtures.forEach(f => {
    const card = document.createElement("div");
    card.className = "fixture-card";

    card.innerHTML = `
      <div class="fixture-info">${f.date} · ${f.time}</div>
      <div class="fixture-teams">
        <span>${f.homeClubId}</span>
        <span class="fixture-vs">VS</span>
        <span>${f.awayClubId}</span>
      </div>
      <div class="fixture-info">${f.venue}</div>
      <div class="fixture-info">${f.scoreLocal} - ${f.scoreAway}</div>
    `;

    grid.appendChild(card);
  });
}
