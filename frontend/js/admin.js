import {
    getFixturesFirestore,
    saveResult,
    FIRESTORE_ENABLED
  } from "./services/firestore.service.js";
  
  const container = document.getElementById("admin-container");
  
  async function renderAdmin() {
  
    if (!FIRESTORE_ENABLED) {
      container.innerHTML = "⚠️ Activá FIRESTORE_ENABLED";
      return;
    }
  
    const fixtures = await getFixturesFirestore();
  
    container.innerHTML = "";
  
    fixtures.forEach(f => {
  
      const card = document.createElement("div");
      card.className = "match-card";
  
      card.innerHTML = `
        <p><strong>${f.homeClubId}</strong> vs <strong>${f.awayClubId}</strong></p>
  
        <input type="number" placeholder="Local" id="l-${f.id}">
        <input type="number" placeholder="Visitante" id="v-${f.id}">
  
        <button data-id="${f.id}">Guardar</button>
      `;
  
      container.appendChild(card);
    });
  
    // guardar resultados
    container.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", async () => {
  
        const id = btn.dataset.id;
  
        const local = document.getElementById(`l-${id}`).value;
        const away = document.getElementById(`v-${id}`).value;
  
        await saveResult(id, local, away);
  
        alert("Resultado guardado ✅");
      });
    });
  }
  
  renderAdmin();