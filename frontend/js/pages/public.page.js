import { getStandings } from "../services/standings.service.js";
import { getFixtures } from "../services/fixtures.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  try {
    const standings = await getStandings();
    renderStandings(standings);

    const fixtures = await getFixtures();
    renderFixtures(fixtures);
  } catch (err) {
    console.error("Error cargando datos:", err.message);
  }
}

/* =====================
   STANDINGS
===================== */
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

/* =====================
   FIXTURES
===================== */
function renderFixtures(fixtures) {
  const container = document.getElementById("fixturesList");
  if (!container) return;

  container.innerHTML = "";

  fixtures.forEach(f => {
    const div = document.createElement("div");
    div.className = "fixture-item";

    div.innerHTML = `
      <strong>${f.homeClubId}</strong>
      ${f.scoreLocal ?? "-"} :
      ${f.scoreAway ?? "-"}
      <strong>${f.awayClubId}</strong>
      <span>(${f.status})</span>
    `;

    container.appendChild(div);
  });
}
