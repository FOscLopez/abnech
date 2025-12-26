import {
  getFixtures,
  saveResult
} from "../services/firestore.service.js";
import { API_BASE } from "./config.js";

export async function initAdminPage() {
  console.log("Admin page init");
  renderFixturesForResults();
}

async function renderFixturesForResults() {
  const container = document.getElementById("fixturesResults");
  if (!container) return;

  container.innerHTML = "";

  const fixtures = await getFixtures();

  fixtures
    .filter(f => f.status !== "finished")
    .forEach(f => {
      const row = document.createElement("div");
      row.className = "fixture-row";

      row.innerHTML = `
        <strong>${f.homeClubId} vs ${f.awayClubId}</strong>
        <input type="number" class="local" placeholder="Local" />
        <input type="number" class="away" placeholder="Visitante" />
        <button>Guardar</button>
      `;

      row.querySelector("button").addEventListener("click", async () => {
        const local = row.querySelector(".local").value;
        const away = row.querySelector(".away").value;

        if (local === "" || away === "") {
          alert("Ingresá ambos resultados");
          return;
        }

        await saveResult(f.id, local, away);
        alert("Resultado guardado");

        renderFixturesForResults();
      });

      container.appendChild(row);
    });
}
