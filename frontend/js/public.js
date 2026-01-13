import { getFixtures } from "./services/fixtures.service.js";

/* =========================
   MAPA DE CLUBES
========================= */
const CLUBS = {
  union: "Unión",
  funebrero: "Funebrero",
  cfa: "CFA",
  "general-vedia": "General Vedia",
  "la-leonesa": "La Leonesa",
  "palermo-cap": "Palermo CAP",
  "puerto-bermejo": "Puerto Bermejo",
  zapallar: "Zapallar",
};

/* =========================
   FIXTURE
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  fixtures.forEach(f => {
    grid.innerHTML += `
      <div class="fixture-card">
        <div class="fixture-teams">
          <span>${CLUBS[f.homeClubId]}</span>
          <span class="fixture-vs">VS</span>
          <span>${CLUBS[f.awayClubId]}</span>
        </div>
        <div class="fixture-info">
          ${f.scoreLocal} - ${f.scoreAway}
        </div>
      </div>
    `;
  });
}

/* =========================
   STANDINGS DESDE FIXTURES
========================= */
function buildStandings(fixtures) {
  const table = {};

  fixtures
    .filter(f => f.status === "finished")
    .forEach(f => {
      const home = f.homeClubId;
      const away = f.awayClubId;

      if (!table[home]) table[home] = baseTeam(home);
      if (!table[away]) table[away] = baseTeam(away);

      table[home].PJ++;
      table[away].PJ++;

      table[home].PF += f.scoreLocal;
      table[home].PC += f.scoreAway;

      table[away].PF += f.scoreAway;
      table[away].PC += f.scoreLocal;

      if (f.scoreLocal > f.scoreAway) {
        table[home].PG++;
        table[away].PP++;
        table[home].PTS += 2;
        table[away].PTS += 1;
      } else {
        table[away].PG++;
        table[home].PP++;
        table[away].PTS += 2;
        table[home].PTS += 1;
      }
    });

  return Object.values(table)
    .map(t => ({ ...t, DG: t.PF - t.PC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function baseTeam(id) {
  return {
    id,
    name: CLUBS[id],
    PJ: 0,
    PG: 0,
    PP: 0,
    PF: 0,
    PC: 0,
    DG: 0,
    PTS: 0,
  };
}

function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  standings.forEach((t, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${t.PJ}</td>
        <td>${t.PG}</td>
        <td>${t.PP}</td>
        <td>${t.PF}</td>
        <td>${t.PC}</td>
        <td>${t.DG}</td>
        <td>${t.PTS}</td>
      </tr>
    `;
  });
}

/* =========================
   INIT
========================= */
export async function initPublicPage() {
  const fixtures = await getFixtures("B1");
  renderFixtures(fixtures);

  const standings = buildStandings(fixtures);
  renderStandings(standings);
}
