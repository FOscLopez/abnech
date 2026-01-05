const API_BASE = "https://abnech.onrender.com";

const loadBtn = document.getElementById("loadBtn");
const categorySelect = document.getElementById("categorySelect");
const tableBody = document.querySelector("#fixturesTable tbody");

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
        <select>
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

      alert("Fixture actualizado");
    });

    tableBody.appendChild(tr);
  });
}
