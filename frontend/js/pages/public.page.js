import { buildStandings } from "../services/firestore.service.js";
import { getClubsFromApi } from "../services/clubs.service.js";
import { getFixturesFromApi } from "../services/fixtures.service.js";
import { getStandings } from "../services/standings.service.js";

const standings = await getStandings();
renderStandings(standings);

export async function initPublicPage() {
  const clubs = await getClubsFromApi();
  const fixtures = await getFixturesFromApi();

  renderFixture(fixtures, clubs);

  const standings = buildStandings(fixtures, clubs);
  renderStandings(standings);
}

function renderFixture(fixtures, clubs) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  fixtures.forEach(match => {
    const home = clubs.find(c => c.id === match.homeClubId);
    const away = clubs.find(c => c.id === match.awayClubId);

    const card = document.createElement("div");
    card.className = "fixture-card";

    card.innerHTML = `
      <div class="fixture-info">Fecha ${match.round || "-"}</div>
      <div class="fixture-teams">
        <span>${home?.name || "Local"}</span>
        <span class="fixture-vs">VS</span>
        <span>${away?.name || "Visitante"}</span>
      </div>
      <div class="fixture-info">${match.date || ""}</div>
    `;

    grid.appendChild(card);
  });
}

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
