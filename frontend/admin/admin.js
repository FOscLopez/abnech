/* ================== FIREBASE AUTH ================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0ypWFEhPWu2jiyTZoW3fd9SPes3wcBdc",
  authDomain: "abnech-basket.firebaseapp.com",
  projectId: "abnech-basket",
  storageBucket: "abnech-basket.firebasestorage.app",
  messagingSenderId: "1020692623846",
  appId: "1:1020692623846:web:a1b37421b2e891b52b6627",
  measurementId: "G-S3KXDNB58S"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

/* ================== ELEMENTOS ================== */
const API_BASE = "https://abnech.onrender.com";

const loadBtn = document.getElementById("loadBtn");
const categorySelect = document.getElementById("categorySelect");
const tableBody = document.querySelector("#fixturesTable tbody");
const statusMsg = document.getElementById("statusMsg");

/* ================== GUARDIA DE SESIÓN ================== */
onAuthStateChanged(auth, user => {
  if (!user) {
    // No logueado → login
    window.location.href = "/login.html";
    return;
  }

  // Logueado → habilitamos acciones
  loadBtn.addEventListener("click", loadFixtures);
  statusMsg.textContent = "Sesión activa. Listo para cargar fixtures.";
});

/* ================== DATA ================== */
async function loadFixtures() {
  const category = categorySelect.value;
  statusMsg.textContent = "Cargando fixtures…";

  try {
    const res = await fetch(`${API_BASE}/api/admin/fixtures/${category}`);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const fixtures = await res.json();
    tableBody.innerHTML = "";
    statusMsg.textContent = "";

    fixtures.forEach(f => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${f.date} ${f.time ?? ""}</td>
        <td>${f.homeClubId}</td>
        <td>${f.awayClubId}</td>
        <td><input type="number" value="${f.scoreLocal ?? ""}" /></td>
        <td><input type="number" value="${f.scoreAway ?? ""}" /></td>
        <td>
          <select>
            <option value="scheduled" ${f.status === "scheduled" ? "selected" : ""}>Programado</option>
            <option value="finished" ${f.status === "finished" ? "selected" : ""}>Finalizado</option>
          </select>
        </td>
        <td><button>Guardar</button></td>
      `;

      const saveBtn = tr.querySelector("button");
      saveBtn.addEventListener("click", () => saveFixture(f.id, tr));

      tableBody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    statusMsg.style.color = "#f87171";
    statusMsg.textContent =
      "Servidor no disponible o error de red. Reintentá en unos segundos.";
  }
}

async function saveFixture(id, tr) {
  const inputs = tr.querySelectorAll("input, select");

  const payload = {
    scoreLocal: Number(inputs[0].value),
    scoreAway: Number(inputs[1].value),
    status: inputs[2].value
  };

  try {
    const res = await fetch(`${API_BASE}/api/admin/fixtures/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    alert("Fixture actualizado");
  } catch (e) {
    alert("Error al guardar. Intente nuevamente.");
  }
}
