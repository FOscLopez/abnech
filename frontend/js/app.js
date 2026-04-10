import { getFixtures, getClubs } from "./services/firestore.service.js";

async function loadData() {

  const fixtures = await getFixtures();
  const clubs = await getClubs();

  const clubMap = {};
  clubs.forEach(c => {
    clubMap[c.id] = c.name;
  });

  // 👉 próximo partido
  const nextMatch = fixtures.find(f => !f.deleted);

  if (nextMatch) {
    renderNextMatch(nextMatch, clubMap);
  }

  // 👉 resultados (finalizados)
  const results = fixtures.filter(f => f.status === "finished");

  renderResults(results, clubMap);
}

/* ========================= */
function renderNextMatch(match, clubMap) {

  const el = document.getElementById("nextMatch");

  const home = clubMap[match.homeClubId] || match.homeClubId;
  const away = clubMap[match.awayClubId] || match.awayClubId;

  el.innerHTML = `
    <div class="match-highlight">

      <div class="team">
        <p>${home}</p>
      </div>

      <div class="vs">VS</div>

      <div class="team">
        <p>${away}</p>
      </div>

    </div>

    <div class="match-info">
      ${match.date || ""} - ${match.time || ""}
    </div>
  `;
}

/* ========================= */
function renderResults(results, clubMap) {

  const el = document.getElementById("results");

  el.innerHTML = results.map(r => {

    const home = clubMap[r.homeClubId] || r.homeClubId;
    const away = clubMap[r.awayClubId] || r.awayClubId;

    return `
      <div class="result-card">
        <span>${r.date || ""}</span>
        <h4>${home} ${r.scoreLocal} - ${r.scoreAway} ${away}</h4>
      </div>
    `;
  }).join("");
}

loadData();