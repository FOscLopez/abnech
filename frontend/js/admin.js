import { login, logout, onAuth } from "./services/auth.service.js";
import { getFixturesFirestore, saveResult, FIRESTORE_ENABLED } 
from "./services/firestore.service.js";

const loginBox = document.getElementById("login-box");
const adminPanel = document.getElementById("admin-panel");
const container = document.getElementById("admin-container");

// =========================
// LOGIN
// =========================
document.getElementById("login-btn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await login(email, password);
  } catch {
    alert("Error login ❌");
  }
});

// =========================
// LOGOUT
// =========================
document.getElementById("logout-btn").addEventListener("click", logout);

// =========================
// ESTADO SESIÓN
// =========================
onAuth(user => {

  if (user) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    renderAdmin();
  } else {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
  }

});

// =========================
// RENDER ADMIN
// =========================
import { getClubs, getFixtures } from "./services/firestore.service.js";
import { saveResult } from "./services/firestore.service.js";

async function renderAdmin() {

  const fixtures = await getFixtures(); // ✅ correcto
  const clubs = await getClubs();

  // mapa de clubes
  const clubMap = {};
  clubs.forEach(c => {
    clubMap[c.id] = c.name;
  });

  // 📅 FILTRO (después de tener fixtures)
  const today = new Date().toISOString().split("T")[0];

  const filtered = fixtures.filter(f => {
    if (!f.date) return true;
    return f.date >= today;
  });

  container.innerHTML = "";

  filtered.forEach(f => {

    const home = clubMap[f.homeClubId] || f.homeClubId;
    const away = clubMap[f.awayClubId] || f.awayClubId;

    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <p><strong>${home}</strong> vs <strong>${away}</strong></p>

      <input type="number" id="l-${f.id}" placeholder="Local">
      <input type="number" id="v-${f.id}" placeholder="Visitante">

      <button data-id="${f.id}">Guardar</button>
    `;

    container.appendChild(card);
  });

  // eventos
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