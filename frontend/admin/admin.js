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
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================== CONFIG ================== */

const API_BASE = "https://abnech.onrender.com";

/* ================== ELEMENTOS ================== */

const loadBtn = document.getElementById("loadBtn");
const createBtn = document.getElementById("createBtn");

const tableBody = document.querySelector("#fixturesTable tbody");
const statusMsg = document.getElementById("statusMsg");

const newDate = document.getElementById("newDate");
const newTime = document.getElementById("newTime");
const newHome = document.getElementById("newHome");
const newAway = document.getElementById("newAway");
const newVenue = document.getElementById("newVenue");

/* ================== FLAGS ================== */

let initialized = false;
let creating = false;

/* ================== AUTH ================== */

onAuthStateChanged(auth, user => {

  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  if (initialized) return;

  initialized = true;

  statusMsg.textContent = "Sesión activa";

  loadBtn.onclick = loadFixtures;
  createBtn.onclick = createFixture;

  loadFixtures();
});

/* ================== CREAR ================== */

async function createFixture() {

  if (creating) return;

  if (
    !newDate.value ||
    !newTime.value ||
    !newHome.value ||
    !newAway.value
  ) {
    alert("Completá todos los campos");
    return;
  }

  if (newHome.value === newAway.value) {
    alert("Local y visitante no pueden ser iguales");
    return;
  }

  creating = true;
  createBtn.disabled = true;

  const payload = {
    categoryId: "B1",
    date: newDate.value,
    time: newTime.value,
    homeClubId: newHome.value,
    awayClubId: newAway.value,
    venue: newVenue.value.trim()
  };

  try {

    const res = await fetch(`${API_BASE}/api/admin/fixtures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();

    limpiar();

    loadFixtures();

  } catch {

    alert("Error al crear");

  } finally {

    creating = false;
    createBtn.disabled = false;
  }
}

function limpiar() {

  newDate.value = "";
  newTime.value = "";
  newHome.value = "";
  newAway.value = "";
  newVenue.value = "";
}

/* ================== CARGAR ================== */

async function loadFixtures() {

  statusMsg.textContent = "Cargando...";

  try {

    const res = await fetch(
      `${API_BASE}/api/admin/fixtures/B1`
    );

    if (!res.ok) throw new Error();

    const fixtures = await res.json();

    tableBody.innerHTML = "";
    statusMsg.textContent = "";

    fixtures.forEach(f => renderRow(f));

  } catch {

    statusMsg.textContent = "Error servidor";
  }
}

/* ================== FILA ================== */

function renderRow(f) {

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${f.date} ${f.time ?? ""}</td>

    <td>${f.homeClubId}</td>

    <td>${f.awayClubId}</td>

    <td><input type="number" value="${f.scoreLocal ?? ""}"></td>

    <td><input type="number" value="${f.scoreAway ?? ""}"></td>

    <td>
      <select>
        <option value="scheduled" ${f.status==="scheduled"?"selected":""}>
          Programado
        </option>
        <option value="finished" ${f.status==="finished"?"selected":""}>
          Finalizado
        </option>
      </select>
    </td>

    <td>
      <button class="save">Guardar</button>
      <button class="delete">Borrar</button>
    </td>
  `;

  tr.querySelector(".save")
    .onclick = () => saveFixture(f.id, tr);

  tr.querySelector(".delete")
    .onclick = () => deleteFixture(f.id);

  tableBody.appendChild(tr);
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

    const res = await fetch(
      `${API_BASE}/api/admin/fixtures/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) throw new Error();

    loadFixtures();

  } catch {

    alert("Error guardar");
  }
}

/* ================== BORRAR ================== */

async function deleteFixture(id) {

  if (!confirm("Eliminar partido?")) return;

  try {

    const res = await fetch(
      `${API_BASE}/api/admin/fixtures/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error();

    loadFixtures();

  } catch {

    alert("Error al borrar");
  }
}
