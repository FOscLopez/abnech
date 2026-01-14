import { getFixtures } from "./services/fixtures.service.js";

/* =========================
   CLUBES
========================= */
const CLUBS = {
  union: { name: "Unión", logo: "/img/clubs/union.png" },
  funebrero: { name: "Funebrero", logo: "/img/clubs/funebrero.png" },
  cfa: { name: "CFA", logo: "/img/clubs/cfa.png" },
  "general-vedia": { name: "General Vedia", logo: "/img/clubs/general-vedia.png" },
  "la-leonesa": { name: "La Leonesa", logo: "/img/clubs/la-leonesa.png" },
  "palermo-cap": { name: "Palermo CAP", logo: "/img/clubs/palermo-cap.png" },
  "puerto-bermejo": { name: "Puerto Bermejo", logo: "/img/clubs/puerto-bermejo.png" },
  zapallar: { name: "Zapallar", logo: "/img/clubs/zapallar.png" },
};

let currentCategory = "B1";

/* =========================
   SKELETONS
========================= */
function renderSkeletons() {
  document.getElementById("fixture-grid").innerHTML = `
    <div class="fixture-card skeleton"></div>
    <div class="fixture-card skeleton"></div>
    <div class="fixture-card skeleton"></div>
  `;

  document.getElementById("standingsBody").innerHTML = `
    <tr class="skeleton-row"><td colspan="9"><div class="skeleton-line"></div></td></tr>
    <tr class="skeleton-row"><td colspan="9"><div class="skeleton-line"></div></td></tr>
    <tr class="skeleton-row"><td colspan="9"><div class="skeleton-line"></div></td></tr>
  `;
}

/* =========================
   FIXTURE
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  grid.innerHTML = "";

  if (!fixtures.length) {
    grid.innerHTML = `<div class="empty-state">No hay partidos</div>`;
    return;
  }

  fixtures.forEach(f => {
    const home = CLUBS[f.homeClubId];
    const away = CLUBS[f.awayClubId];
    if (!home || !away) return;

    grid.innerHTML += `
      <div class="fixture-card animate-in">
        <div class="fixture-team">
          <img src="${home.logo}">
          <span>${home.name}</span>
        </div>
        <div class="fixture-center">
          ${f.scoreLocal} - ${f.scoreAway}
        </div>
        <div class="fixture-team">
          <img src="${away.logo}">
          <span>${away.name}</span>
        </div>
      </div>
    `;
  });
}

/* =========================
   STANDINGS
========================= */
function baseTeam(id) {
  return {
    name: CLUBS[id].name,
    logo: CLUBS[id].logo,
    PJ: 0, PG: 0, PP: 0, PF: 0, PC: 0, DG: 0, PTS: 0,
  };
}

function buildStandings(fixtures) {
  const table = {};
  fixtures.filter(f => f.status === "finished").forEach(f => {
    const h = f.homeClubId;
    const a = f.awayClubId;

    if (!table[h]) table[h] = baseTeam(h);
    if (!table[a]) table[a] = baseTeam(a);

    table[h].PJ++; table[a].PJ++;
    table[h].PF += f.scoreLocal; table[h].PC += f.scoreAway;
    table[a].PF += f.scoreAway; table[a].PC += f.scoreLocal;

    if (f.scoreLocal > f.scoreAway) {
      table[h].PG++; table[a].PP++;
      table[h].PTS += 2; table[a].PTS += 1;
    } else {
      table[a].PG++; table[h].PP++;
      table[a].PTS += 2; table[h].PTS += 1;
    }
  });

  return Object.values(table)
    .map(t => ({ ...t, DG: t.PF - t.PC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  tbody.innerHTML = "";

  if (!standings.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state">Sin tabla</div></td></tr>`;
    return;
  }

  standings.forEach((t, i) => {
    tbody.innerHTML += `
      <tr class="animate-in ${i === 0 ? "leader" : ""}">
        <td>${i + 1}</td>
        <td class="club-cell">
          <img src="${t.logo}">
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
   CATEGORÍA CON ANIMACIÓN
========================= */
async function loadCategory(categoryId) {
  currentCategory = categoryId;

  document.querySelector(".content-area")?.classList.add("fade-out");

  setTimeout(async () => {
    renderSkeletons();

    const fixtures = await getFixtures(categoryId);
    renderFixtures(fixtures);
    renderStandings(buildStandings(fixtures));

    document.querySelector(".content-area")?.classList.remove("fade-out");
  }, 250);
}

/* =========================
   INIT
========================= */
export function initPublicPage() {
  loadCategory(currentCategory);

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".category-btn.active")?.classList.remove("active");
      btn.classList.add("active");

      loadCategory(btn.dataset.category);
    });
  });
}
