import { getFixtures } from "./services/fixtures.service.js";

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

let allFixtures = [];
let expandedMatchId = null;
let currentCategory = "B1";

/* ================= INIT ================= */
export async function initPublicPage() {
  populateClubFilter();
  bindFilters();
  await loadCategory(currentCategory);
}

/* ================= FILTROS ================= */
function populateClubFilter() {
  const select = document.getElementById("filterClub");
  if (!select) return;

  Object.entries(CLUBS).forEach(([id, club]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = club.name;
    select.appendChild(opt);
  });
}

function bindFilters() {
  ["filterRound", "filterStatus", "filterClub"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", applyFilters);
  });
}

function applyFilters() {
  let filtered = [...allFixtures];

  const round = document.getElementById("filterRound").value;
  const status = document.getElementById("filterStatus").value;
  const club = document.getElementById("filterClub").value;

  if (round) filtered = filtered.filter(f => Number(f.round ?? f.order) === Number(round));
  if (status !== "all") filtered = filtered.filter(f => f.status === status);
  if (club !== "all") {
    filtered = filtered.filter(
      f => f.homeClubId === club || f.awayClubId === club
    );
  }

  expandedMatchId = null;
  renderFixtures(filtered);
}

/* ================= DATA ================= */
async function loadCategory(category) {
  showSkeleton("fixture-skeleton");
  showSkeleton("table-skeleton");

  allFixtures = await getFixtures(category);

  renderFixtures(allFixtures);
  renderStandings(buildStandings(allFixtures));

  hideSkeleton("fixture-skeleton");
  hideSkeleton("table-skeleton");
}

/* ================= FIXTURE ================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  if (!fixtures.length) {
    grid.innerHTML = `<div class="empty-state">Sin resultados</div>`;
    return;
  }

  grid.innerHTML = fixtures.map(f => {
    const h = CLUBS[f.homeClubId];
    const a = CLUBS[f.awayClubId];
    if (!h || !a) return "";

    const isOpen = expandedMatchId === f.id;

    return `
      <div class="fixture-card ${isOpen ? "open" : ""}" data-id="${f.id}">
        <div class="fixture-main">
          <div class="fixture-team"><img src="${h.logo}"><span>${h.name}</span></div>
          <div class="fixture-center">${f.scoreLocal ?? "-"} - ${f.scoreAway ?? "-"}</div>
          <div class="fixture-team"><img src="${a.logo}"><span>${a.name}</span></div>
        </div>

        ${isOpen ? renderDetails(f) : ""}
      </div>
    `;
  }).join("");

  bindExpandEvents();
}

function bindExpandEvents() {
  document.querySelectorAll(".fixture-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      expandedMatchId = expandedMatchId === id ? null : id;
      renderFixtures(allFixtures);
    });
  });
}

function renderDetails(f) {
  return `
    <div class="fixture-details">
      <div><strong>Jornada:</strong> ${f.round ?? f.order ?? "-"}</div>
      <div><strong>Estado:</strong> ${f.status}</div>
      <div><strong>Fecha:</strong> ${f.date ?? "-"}</div>
      <div><strong>Hora:</strong> ${f.time ?? "-"}</div>
      <div><strong>Sede:</strong> ${f.venue ?? "-"}</div>
    </div>
  `;
}

/* ================= TABLA ================= */
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
      table[h].PG++; table[h].PTS += 2;
      table[a].PP++; table[a].PTS += 1;
    } else {
      table[a].PG++; table[a].PTS += 2;
      table[h].PP++; table[h].PTS += 1;
    }
  });

  return Object.values(table)
    .map(t => ({ ...t, DG: t.PF - t.PC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function baseTeam(id) {
  return {
    id,
    name: CLUBS[id].name,
    logo: CLUBS[id].logo,
    PJ: 0, PG: 0, PP: 0, PF: 0, PC: 0, DG: 0, PTS: 0,
  };
}

function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  tbody.innerHTML = standings.map((t, i) => `
    <tr class="${i === 0 ? "leader" : ""}">
      <td>${i + 1}</td>
      <td class="club-cell"><img src="${t.logo}">${t.name}</td>
      <td>${t.PJ}</td><td>${t.PG}</td><td>${t.PP}</td>
      <td>${t.PF}</td><td>${t.PC}</td>
      <td class="${t.DG >= 0 ? "dg-positive" : "dg-negative"}">${t.DG}</td>
      <td class="pts">${t.PTS}</td>
    </tr>
  `).join("");
}

/* ================= HELPERS ================= */
function showSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}
function hideSkeleton(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}
