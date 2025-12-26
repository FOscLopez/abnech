// js/ui/renderResults.js

import { fixtureData } from "../data/fixture.data.js";
import { getCurrentCategory } from "../services/category.service.js";

export function renderResults(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const categoria = getCurrentCategory();

  const resultados = fixtureData.filter(
    p => p.categoria === categoria && p.estado === "Finalizado"
  );

  container.innerHTML = "";

  if (resultados.length === 0) {
    container.innerHTML = `<p>No hay resultados para ${categoria}</p>`;
    return;
  }

  resultados.forEach(p => {
    const card = document.createElement("article");
    card.className = "result-card";

    card.innerHTML = `
      <h3>${p.fecha}</h3>
      <p>${p.local} <strong>${p.scoreLocal}</strong> - 
         <strong>${p.scoreVisitante}</strong> ${p.visitante}</p>
      <p>${p.cancha}</p>
    `;

    container.appendChild(card);
  });
}
