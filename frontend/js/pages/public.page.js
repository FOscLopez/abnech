import { getStandings } from "../services/standings.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  try {
    const standings = await getStandings();
    console.log("Standings recibidos:", standings);
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
      <td>${t.name ?? "-"}</td>
      <td>${t.PJ ?? 0}</td>
      <td>${t.PG ?? 0}</td>
      <td>${t.PP ?? 0}</td>
      <td>${t.PF ?? 0}</td>
      <td>${t.PC ?? 0}</td>
      <td>${t.DG ?? 0}</td>
      <td>${t.PTS ?? 0}</td>
    `;

    tableBody.appendChild(tr);
  });
}
