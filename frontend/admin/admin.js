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


/* ================== CONFIG ================== */

const API_BASE = "https://abnech.onrender.com";


/* ================== ELEMENTOS ================== */

const loadBtn = document.getElementById("loadBtn");
const createBtn = document.getElementById("createBtn");

const categorySelect = document.getElementById("categorySelect");
const tableBody = document.querySelector("#fixturesTable tbody");
const statusMsg = document.getElementById("statusMsg");

/* Crear */
const newDate = document.getElementById("newDate");
const newTime = document.getElementById("newTime");
const newHome = document.getElementById("newHome");
const newAway = document.getElementById("newAway");
const newVenue = document.getElementById("newVenue");


/* ================== AUTH ================== */

onAuthStateChanged(auth, user => {

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  statusMsg.textContent = "Sesión activa.";

  loadBtn.addEventListener("click", loadFixtures);
  createBtn.addEventListener("click", createFixture);

});


/* ================== CREAR FIXTURE ================== */

async function createFixture() {

  const categoryId = categorySelect.value;

  if (
    !newDate.value ||
    !newHome.value ||
    !newAway.value
  ) {
    alert("Completá fecha, local y visitante");
    return;
  }

  const payload = {
    categoryId,
    date: newDate.value,
    time: newTime.value,
    homeClubId: newHome.value.trim(),
    awayClubId: newAway.value.trim(),
    venue: newVenue.value.trim()
  };

  statusMsg.textContent = "Creando fixture…";

  try {

    const res = await fetch(`${API_BASE}/api/admin/fixtures`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    statusMsg.textContent = "Fixture creado ✅";

    clearCreateForm();

    loadFixtures();

  } catch {

    statusMsg.style.color = "#f87171";
    statusMsg.textContent = "Error creando fixture";

  }

}

function clearCreateForm() {

  newDate.value = "";
  newTime.value = "";
  newHome.value = "";
  newAway.value = "";
  newVenue.value = "";

}


/* ================== CARGAR FIXTURES ================== */

async function loadFixtures() {

  const category = categorySelect.value;

  statusMsg.textContent = "Cargando fixtures…";

  try {

    const res = await fetch(`${API_BASE}/api/admin/fixtures/${category}`);

    if (!res.ok) throw new Error();

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
    statusMsg.textContent = "Error cargando fixtures";

  }

}


/* ================== GUARDAR ================== */

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

    if (!res.ok) throw new Error();

    alert("Fixture actualizado ✅");

  } catch {

    alert("Error al guardar");

  }

}
