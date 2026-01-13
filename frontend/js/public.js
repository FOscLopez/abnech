import { getFixtures } from "./services/fixtures.service.js";

/* =========================
   CLUBES (nombre + logo)
========================= */
const CLUBS = {
  union: {
    name: "Unión",
    logo: "/img/clubs/union.png",
  },
  funebrero: {
    name: "Funebrero",
    logo: "/img/clubs/palermo.png",
  },
  cfa: {
    name: "CFA",
    logo: "/img/clubs/cfa.png",
  },
  "general-vedia": {
    name: "General Vedia",
    logo: "/img/clubs/general-vedia.png",
  },
  "la-leonesa": {
    name: "La Leonesa",
    logo: "/img/clubs/la-leonesa.png",
  },
  "palermo-cap": {
    name: "Palermo CAP",
    logo: "/img/clubs/palermo-cap.png",
  },
  "puerto-bermejo": {
    name: "Puerto Bermejo",
    logo: "/img/clubs/puerto-bermejo.png",
  },
  zapallar: {
    name: "Zapallar",
    logo: "/img/clubs/zapallar.png",
  },
};

/* =========================
   FIXTURE
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  fixtures.forEach(f => {
    const home = CLUBS[f.homeClubId];
    const away = CLUBS[f.awayClubId];
    if (!home || !away) return;

    grid.innerHTML += `
      <div class="fixture-card">
        <div class="fixture-team">
          <img src="${home.logo}" alt="${home.name}" />
          <span>${home.name}</span>
        </div>

        <div class="fixture-center">
          <span class="fixture-vs">VS</span>
          <div class="fixture-score">${f.scoreLocal} - ${f.scoreAway}</div>
        </div>

        <div class="fixture-team">
          <img src="${away.logo}" alt="${away.name}" />
          <span>${away.name}</span>
        </div>
      </div>
    `;
  });
}

/* =========================
   STANDINGS DESDE FIXTURE
========================= */
function baseTeam(id) {
  return {
    id,
    name: CLUBS[id].name,
    logo: CLUBS[id].logo,
    PJ: 0,
    PG: 0,
    PP: 0,
    PF: 0,
    PC: 0,
    DG: 0,
    PTS: 0,
  };
}

function buildStandings(fixtures) {
  const table = {};

  fixtures
    .filter(f => f.status === "finished")
    .forEach(f => {
      const h = f.homeClubId;
      const a = f.awayClubId;

      if (!table[h]) table[h] = baseTeam(h);
      if (!table[a]) table[a] = baseTeam(a);

      table[h].PJ++;
      table[a].PJ++;

      table[h].PF += f.scoreLocal;
      table[h].PC += f.scoreAway;
      table[a].PF += f.scoreAway;
      table[a].PC += f.scoreLocal;

      if (f.scoreLocal > f.scoreAway) {
        table[h].PG++;
        table[a].PP++;
        table[h].PTS += 2;
        table[a].PTS += 1;
      } else {
        table[a].PG++;
        table[h].PP++;
        table[a].PTS += 2;
        table[h].PTS += 1;
      }
    });

  return Object.values(table)
    .map(t => ({ ...t, DG: t.PF - t.PC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  standings.forEach((t, i) => {
    tbody.innerHTML += `
      <tr class="${i === 0 ? "leader" : ""}">
        <td>${i + 1}</td>
        <td class="club-cell">
          <img src="${t.logo}" alt="${t.name}" />
          <span>${t.name}</span>
        </td>
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
