// js/ui/renderFixture.js

import { fixtureData } from "../data/fixture.data.js";
import { getCurrentCategory } from "../services/category.service.js";

export function renderFixture(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categoria = getCurrentCategory();

  const partidos = fixtureData.filter(
    p => p.categoria === categoria && p.estado !== "Finalizado"
  );

  container.innerHTML = "";

  if (partidos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        No hay partidos programados para ${categoria}
      </div>
    `;
    return;
  }

  partidos.forEach(p => {
    const card = document.createElement("article");
    card.className = "match-card";

    card.innerHTML = `
      <h3>${p.fecha}</h3>
      <p>${p.diaHora}</p>
      <p><strong>${p.local}</strong> vs <strong>${p.visitante}</strong></p>
      <p>${p.cancha}</p>
      <p class="match-status">⏳ Partido programado</p>
    `;

    container.appendChild(card);
  });
}
