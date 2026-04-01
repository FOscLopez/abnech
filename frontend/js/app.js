import { onAuth, getCurrentUser } from "./services/auth.service.js";

async function loadData() {
  const res = await fetch("http://localhost:3000/api/fixture");
  const data = await res.json();

  renderNextMatch(data.nextMatch);
  renderResults(data.results);
}

/* ========================= */
function renderNextMatch(match) {
  const el = document.getElementById("nextMatch");

  el.innerHTML = `
    <div class="match-highlight">

      <div class="team">
        <img src="${match.homeLogo}">
        <p>${match.home}</p>
      </div>

      <div class="vs">VS</div>

      <div class="team">
        <img src="${match.awayLogo}">
        <p>${match.away}</p>
      </div>

    </div>

    <div class="match-info">
      ${match.date} - ${match.time}
    </div>
  `;
}

/* ========================= */
import { saveResult } from "./services/firestore.service.js";

function renderResults(results) {
  const el = document.getElementById("results");

  const user = getCurrentUser();

  el.innerHTML = results.map(r => `
    <div class="result-card">
      <span>${r.date}</span>
      <h4>
        ${r.home} 
        <input type="number" value="${r.homeScore || 0}" id="h-${r.id}" ${!user ? "disabled" : ""}>
        -
        <input type="number" value="${r.awayScore || 0}" id="a-${r.id}" ${!user ? "disabled" : ""}>
        ${r.away}
      </h4>

      ${
        user
          ? `<button class="save-btn" data-id="${r.id}">Guardar</button>`
          : ""
      }

    </div>
  `).join("");

  // 🔥 GUARDAR RESULTADOS
  if (user) {
    document.querySelectorAll(".save-btn").forEach(btn => {

      btn.addEventListener("click", async () => {

        const id = btn.dataset.id;

        const home = document.getElementById(`h-${id}`).value;
        const away = document.getElementById(`a-${id}`).value;

        try {
          await saveResult(id, home, away);
          alert("Resultado actualizado ✅");
        } catch (e) {
          alert("Error al guardar ❌");
        }

      });

    });
  }
}

/* ========================= */
// 🔐 DETECTAR LOGIN GLOBAL
onAuth(user => {
  console.log("Estado auth:", user ? "logueado" : "no logueado");

  loadData();
});

/* ========================= */