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
async function renderAdmin() {

  if (!FIRESTORE_ENABLED) {
    container.innerHTML = "⚠️ Activá FIRESTORE";
    return;
  }

  const fixtures = await getFixturesFirestore();

  container.innerHTML = "";

  fixtures.forEach(f => {

    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <p><strong>${f.homeClubId}</strong> vs <strong>${f.awayClubId}</strong></p>

      <input type="number" id="l-${f.id}" placeholder="Local">
      <input type="number" id="v-${f.id}" placeholder="Visitante">

      <button data-id="${f.id}">Guardar</button>
    `;

    container.appendChild(card);
  });

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