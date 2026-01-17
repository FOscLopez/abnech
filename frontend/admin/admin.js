import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const API_BASE = "https://abnech.onrender.com";

const loadBtn = document.getElementById("loadBtn");
const logoutBtn = document.getElementById("logoutBtn");
const categorySelect = document.getElementById("categorySelect");
const tableBody = document.querySelector("#fixturesTable tbody");

let currentRole = null;

// 🔐 AUTH GUARD
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  if (user.email === "admin@abnech.com") {
    currentRole = "admin";
  } else if (user.email === "editor@abnech.com") {
    currentRole = "editor";
  } else {
    alert("Acceso no autorizado");
    signOut(auth);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../login.html";
  });
});

loadBtn.addEventListener("click", loadFixtures);

async function loadFixtures() {
  const category = categorySelect.value;

  const res = await fetch(`${API_BASE}/api/admin/fixtures/${category}`);
  const fixtures = await res.json();

  tableBody.innerHTML = "";

  fixtures.forEach(f => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${f.date} ${f.time}</td>
      <td>${f.homeClubId}</td>
      <td>${f.awayClubId}</td>
      <td><input type="number" value="${f.scoreLocal ?? ""}" /></td>
      <td><input type="number" value="${f.scoreAway ?? ""}" /></td>
      <td>
        <select ${currentRole === "editor" ? "disabled" : ""}>
          <option value="scheduled" ${f.status === "scheduled" ? "selected" : ""}>Programado</option>
          <option value="finished" ${f.status === "finished" ? "selected" : ""}>Finalizado</option>
        </select>
      </td>
      <td>
        <button>Guardar</button>
      </td>
    `;

    const saveBtn = tr.querySelector("button");
    saveBtn.addEventListener("click", async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = "Guardando...";

      const inputs = tr.querySelectorAll("input, select");

      const payload = {
        scoreLocal: Number(inputs[0].value),
        scoreAway: Number(inputs[1].value),
        status: inputs[2].value
      };

      await fetch(`${API_BASE}/api/admin/fixtures/${f.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      saveBtn.textContent = "Guardado";
      setTimeout(() => {
        saveBtn.textContent = "Guardar";
        saveBtn.disabled = false;
      }, 800);
    });

    tableBody.appendChild(tr);
  });
}
