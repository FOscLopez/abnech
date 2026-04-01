// js/ui/renderFixture.js

import { getCurrentCategory } from "../services/category.service.js";
import { getFixtures } from "../services/fixtures.service.js";
import { getFixturesFirestore, FIRESTORE_ENABLED } from "../services/firestore.service.js";

// fallback (seguridad total)
import { fixtureData } from "../data/fixture.data.js";

export async function renderFixture(containerId) {

  const container = document.getElementById(containerId);
  if (!container) return;

  const categoria = getCurrentCategory();

  let partidos = [];

  try {

    // 🔥 PRIORIDAD
    if (FIRESTORE_ENABLED) {
      partidos = await getFixturesFirestore(categoria);
    } else {
      partidos = await getFixtures(categoria);
    }

  } catch (error) {
    console.warn("⚠️ fallback a datos locales", error);

    // fallback seguro
    partidos = fixtureData.filter(
      p => p.categoria === categoria && p.estado !== "Finalizado"
    );
  }

  container.innerHTML = "";

  if (!partidos || partidos.length === 0) {
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
      <h3>${p.fecha || "-"}</h3>
      <p>${p.diaHora || "-"}</p>
      <p>
        <strong>${p.local || p.home || "-"}</strong> 
        vs 
        <strong>${p.visitante || p.away || "-"}</strong>
      </p>
      <p>${p.cancha || "-"}</p>
      <p class="match-status">
        ${p.estado === "Finalizado" ? "✅ Finalizado" : "⏳ Programado"}
      </p>
    `;

    container.appendChild(card);
  });
}