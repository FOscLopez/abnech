import { getStandings } from "../services/standings.service.js";

export async function initPublicPage() {
  console.log("Public page init");

  const tbody = document.getElementById("standingsBody");
  tbody.innerHTML = "";

  const standings = await getStandings();

  standings.forEach((team, index) => {
    const tr = document.createElement("tr");

    // 🔒 FORZAMOS clubId COMO FUENTE DE VERDAD
    const clubId = team.clubId || team.id;
    const logo = `${clubId}.png`;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="club-cell">
        <img 
          src="./img/clubs/${logo}" 
          alt="${team.name}"
          class="club-logo"
        />
        ${team.name}
      </td>
      <td>${team.PJ}</td>
      <td>${team.PG}</td>
      <td>${team.PP}</td>
      <td>${team.PF}</td>
      <td>${team.PC}</td>
      <td>${team.DG}</td>
      <td>${team.PTS}</td>
    `;

    tbody.appendChild(tr);
  });
}
