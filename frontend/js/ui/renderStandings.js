// js/ui/renderStandings.js

import { getCurrentCategory } from "../services/category.service.js";
import { calculateStandings } from "../services/standings.service.js";

export function renderStandings(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const category = getCurrentCategory();
  const standings = calculateStandings(category);

  container.innerHTML = "";

  if (standings.length === 0) {
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
      </tr>
    </thead>
    <tbody>
      ${standings
        .map(
          (t, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${t.equipo}</td>
          <td>${t.pj}</td>
          <td>${t.pg}</td>
          <td>${t.pp}</td>
          <td>${t.pf}</td>
          <td>${t.pc}</td>
          <td>${t.dif > 0 ? "+" + t.dif : t.dif}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  container.appendChild(table);
}
