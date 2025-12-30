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
   STANDINGS (YA OK)
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
   FIXTURE (ESTE ES EL PASO NUEVO)
===================== */
function renderFixtures(fixtures) {
  const container = document.getElementById("fixtureList");
  if (!container) {
    console.warn("No existe #fixtureList en el HTML");
    return;
  }

  container.innerHTML = "";

  if (!fixtures.length) {
    container.innerHTML = "<p>No hay partidos cargados</p>";
    return;
  }

  fixtures.forEach(f => {
    const div = document.createElement("div");
    div.className = "fixture-item";

    div.innerHTML = `
      <div>
        <strong>${f.homeClubId}</strong>
        ${f.scoreLocal ?? "-"} :
        ${f.scoreAway ?? "-"}
        <strong>${f.awayClubId}</strong>
      </div>
      <div>
        ${f.date} - ${f.time} | ${f.venue}
      </div>
      <div>
        Estado: ${f.status}
      </div>
      <hr />
    `;

    container.appendChild(div);
  });
}
