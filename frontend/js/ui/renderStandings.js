// js/ui/renderStandings.js

import { getCurrentCategory } from "../services/category.service.js";
import { getFixtures } from "../services/fixtures.service.js";
import { getFixturesFirestore, getClubs, buildStandings, FIRESTORE_ENABLED } from "../services/firestore.service.js";

// fallback opcional (si querés mantener seguridad total)
import { fixtureData } from "../data/fixture.data.js";

export async function renderStandings(containerId) {

  const container = document.getElementById(containerId);
  if (!container) return;

  const category = getCurrentCategory();

  let fixtures = [];
  let clubs = [];

  try {

    // 🔥 FIRESTORE MODE
    if (FIRESTORE_ENABLED) {
      fixtures = await getFixturesFirestore(category);
      clubs = await getClubs();
    } 
    // 🔥 BACKEND MODE
    else {
      fixtures = await getFixtures(category);

      // 👉 generamos clubs desde fixtures (simple fallback)
      const names = new Set();
      fixtures.forEach(f => {
        if (f.home) names.add(f.home);
        if (f.away) names.add(f.away);
      });

      clubs = Array.from(names).map((name, i) => ({
        id: name,
        name
      }));
    }

  } catch (error) {
    console.warn("⚠️ fallback standings", error);

    fixtures = fixtureData;
    clubs = [];
  }

  // 🔥 USAMOS TU MOTOR PRO
  const standings = buildStandings(fixtures, clubs);

  container.innerHTML = "";

  if (!standings || standings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        No hay datos suficientes para generar la tabla de ${category}
      </div>
    `;
    return;
  }

  const table = document.createElement("table");
  table.className = "standings-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Equipo</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PP</th>
        <th>PF</th>
        <th>PC</th>
        <th>DIF</th>
        <th>PTS</th>
      </tr>
    </thead>
    <tbody>
      ${standings
        .map(
          (t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${t.name}</td>
          <td>${t.PJ}</td>
          <td>${t.PG}</td>
          <td>${t.PP}</td>
          <td>${t.PF}</td>
          <td>${t.PC}</td>
          <td>${t.DG > 0 ? "+" + t.DG : t.DG}</td>
          <td><strong>${t.PTS}</strong></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  container.appendChild(table);
}