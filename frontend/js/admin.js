async function renderAdmin() {

  const fixtures = await getFixtures();
  const clubs = await getClubs();

  console.log("fixtures:", fixtures); // debug

  // mapa clubes
  const clubMap = {};
  clubs.forEach(c => {
    clubMap[c.id] = c.name;
  });

  // ❗ FILTRO CORREGIDO
  const filtered = fixtures.filter(f => {

    // ignorar eliminados
    if (f.deleted === true) return false;

    return true;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = "No hay partidos disponibles";
    return;
  }

  filtered.forEach(f => {

    const home = clubMap[f.homeClubId] || f.homeClubId;
    const away = clubMap[f.awayClubId] || f.awayClubId;

    const card = document.createElement("div");
    card.className = "match-card";

    card.innerHTML = `
      <p><strong>${home}</strong> vs <strong>${away}</strong></p>

      <small>${f.date || ""} ${f.time || ""}</small>

      <input type="number" id="l-${f.id}" value="${f.scoreLocal || ""}" placeholder="Local">
      <input type="number" id="v-${f.id}" value="${f.scoreAway || ""}" placeholder="Visitante">

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