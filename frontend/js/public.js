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
let lastCategoryRendered = null;
let allFixtures = [];

/* =========================
   FIXTURE RENDER
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (fixtures.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay partidos con estos filtros</div>`;
    return;
  }

  fixtures.forEach(f => {
    const h = CLUBS[f.homeClubId];
    const a = CLUBS[f.awayClubId];
    if (!h || !a) return;

    grid.innerHTML += `
      <div class="fixture-card animate-in">
        <div class="fixture-team">
          <img src="${h.logo}">
          <span>${h.name}</span>
        </div>
        <div class="fixture-center">
          ${f.scoreLocal} - ${f.scoreAway}
        </div>
        <div class="fixture-team">
          <img src="${a.logo}">
          <span>${a.name}</span>
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
    id,
    name: CLUBS[id].name,
    logo: CLUBS[id].logo,
    PJ: 0, PG: 0, PP: 0, PF: 0, PC: 0, DG: 0, PTS: 0,
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
  if (!tbody) return;

  tbody.innerHTML = standings.map((t, i) => `
    <tr class="${i === 0 ? "leader" : ""}">
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
      <td class="${t.DG > 0 ? "dg-positive" : t.DG < 0 ? "dg-negative" : ""}">${t.DG}</td>
      <td class="pts">${t.PTS}</td>
    </tr>
  `).join("");
}

/* =========================
   FILTROS
========================= */
function applyFilters() {
  const round = document.getElementById("filter-round").value;
  const status = document.getElementById("filter-status").value;
  const club = document.getElementById("filter-club").value;

  let filtered = [...allFixtures];

  if (round) {
    filtered = filtered.filter(f => Number(f.order) === Number(round));
  }

  if (status !== "all") {
    filtered = filtered.filter(f => f.status === status);
  }

  if (club !== "all") {
    filtered = filtered.filter(
      f => f.homeClubId === club || f.awayClubId === club
    );
  }

  renderFixtures(filtered);
}

/* =========================
   CARGA CATEGORÍA
========================= */
async function loadCategory(category) {
  if (category === lastCategoryRendered) return;
  lastCategoryRendered = category;
  currentCategory = category;

  showSkeleton("fixture-skeleton");
  showSkeleton("table-skeleton");

  allFixtures = await getFixtures(category);

  hideSkeleton("fixture-skeleton");
  hideSkeleton("table-skeleton");

  renderFixtures(allFixtures);
  renderStandings(buildStandings(allFixtures));
}

/* =========================
   INIT
========================= */
export function initPublicPage() {
  loadCategory(currentCategory);

  // llenar select de clubes
  const clubSelect = document.getElementById("filter-club");
  Object.entries(CLUBS).forEach(([id, club]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = club.name;
    clubSelect.appendChild(opt);
  });

  document
    .querySelectorAll("#filter-round, #filter-status, #filter-club")
    .forEach(el => el.addEventListener("change", applyFilters));
}

/* =========================
   HELPERS
========================= */
function showSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hideSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
