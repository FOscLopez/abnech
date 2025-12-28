import { getStandings } from "../services/standings.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  try {
    const standings = await getStandings();

    if (!Array.isArray(standings)) {
      throw new Error("La API no devolvió un array de standings");
    }

    renderStandings(standings);
  } catch (err) {
    console.error("Error cargando standings:", err.message);
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
