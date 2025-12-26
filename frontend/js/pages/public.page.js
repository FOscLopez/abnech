import { buildStandings } from "../services/firestore.service.js";
import { getClubsFromApi } from "../services/clubs.service.js";
import { getFixturesFromApi } from "../services/fixtures.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  try {
    const clubs = await getClubsFromApi();
    const fixtures = await getFixturesFromApi();

    const standings = buildStandings(fixtures, clubs);
    renderStandings(standings);
  } catch (error) {
    console.error("Error cargando datos públicos:", error);
  }
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
