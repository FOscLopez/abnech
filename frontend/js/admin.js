import { login, logout, onAuth } from "./services/auth.service.js";

import { 
  getClubs, 
  getFixtures, 
  saveResult 
} from "./services/firestore.service.js";

document.addEventListener("DOMContentLoaded", () => {

  const loginBox = document.getElementById("login-box");
  const adminPanel = document.getElementById("admin-panel");
  const container = document.getElementById("admin-container");

  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // =========================
  // LOGIN
  // =========================
  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login attempt...");

    try {
      await login(email, password);
      console.log("Login OK");
    } catch (e) {
      console.error(e);
      alert("Error login ❌");
    }

  });

  // =========================
  // LOGOUT
  // =========================
  logoutBtn.addEventListener("click", logout);

  // =========================
  // ESTADO SESIÓN
  // =========================
  onAuth(user => {

    console.log("Auth state:", user);

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

    const fixtures = await getFixtures();
    const clubs = await getClubs();

    const clubMap = {};
    clubs.forEach(c => {
      clubMap[c.id] = c.name;
    });

    const filtered = fixtures.filter(f => !f.deleted);

    container.innerHTML = "";

    filtered.forEach(f => {

      const home = clubMap[f.homeClubId] || f.homeClubId;
      const away = clubMap[f.awayClubId] || f.awayClubId;

      const card = document.createElement("div");
      card.className = "match-card";

      card.innerHTML = `
        <p><strong>${home}</strong> vs <strong>${away}</strong></p>
        <small>${f.date || ""} ${f.time || ""}</small>

        <input type="number" id="l-${f.id}" value="${f.scoreLocal || ""}">
        <input type="number" id="v-${f.id}" value="${f.scoreAway || ""}">

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

});