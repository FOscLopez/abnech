import { getFixtures } from "./services/fixtures.service.js";

const STORAGE_KEY = "abnech_ui_state";

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

/* ================== INIT ================== */
export async function initPublicPage() {
  restoreUIState();
  populateClubFilter();
  bindFilters();
  await loadCategory(currentCategory);
  restoreScroll();
}

/* ================== PERSISTENCIA ================== */
function saveUIState() {
  const state = {
    category: currentCategory,
    round: document.getElementById("filterRound")?.value || "",
    status: document.getElementById("filterStatus")?.value || "all",
    club: document.getElementById("filterClub")?.value || "all",
    expanded: expandedMatchId,
    scroll: window.scrollY,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreUIState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const state = JSON.parse(raw);

  currentCategory = state.category || currentCategory;
  expandedMatchId = state.expanded || null;

  if (state.round) document.getElementById("filterRound").value = state.round;
  if (state.status) document.getElementById("filterStatus").value = state.status;
  if (state.club) document.getElementById("filterClub").value = state.club;
}

function restoreScroll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const { scroll } = JSON.parse(raw);
  if (scroll) requestAnimationFrame(() => window.scrollTo(0, scroll));
}

/* ================== FILTROS ================== */
function populateClubFilter() {
  const select = document.getElementById("filterClub");
  Object.entries(CLUBS).forEach(([id, club]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = club.name;
    select.appendChild(opt);
  });
}

function bindFilters() {
  ["filterRound", "filterStatus", "filterClub"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      expandedMatchId = null;
      applyFilters();
      saveUIState();
    });
  });

  window.addEventListener("scroll", () => saveUIState(), { passive: true });
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

  renderFixtures(filtered);
}

/* ================== DATA ================== */
async function loadCategory(category) {
  allFixtures = await getFixtures(category);
  renderFixtures(allFixtures);
  renderStandings(buildStandings(allFixtures));
}

/* ================== FIXTURE ================== */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");

  grid.innerHTML = fixtures.length
    ? fixtures.map(f => {
        const open = expandedMatchId === f.id;
        return `
          <div class="fixture-card ${open ? "open" : ""}" data-id="${f.id}">
            <div class="fixture-main">
              <div>${CLUBS[f.homeClubId].name}</div>
              <div>${f.scoreLocal ?? "-"} - ${f.scoreAway ?? "-"}</div>
              <div>${CLUBS[f.awayClubId].name}</div>
            </div>
            ${open ? renderDetails(f) : ""}
          </div>
        `;
      }).join("")
    : `<div class="empty-state">Sin resultados</div>`;

  document.querySelectorAll(".fixture-card").forEach(card => {
    card.addEventListener("click", () => {
      expandedMatchId = expandedMatchId === card.dataset.id ? null : card.dataset.id;
      renderFixtures(allFixtures);
      saveUIState();
    });
  });
}

function renderDetails(f) {
  return `
    <div class="fixture-details">
      <div><strong>Jornada:</strong> ${f.round ?? f.order ?? "-"}</div>
      <div><strong>Estado:</strong> ${f.status}</div>
      <div><strong>Fecha:</strong> ${f.date ?? "-"}</div>
      <div><strong>Sede:</strong> ${f.venue ?? "-"}</div>
    </div>
  `;
}

/* ================== TABLA ================== */
function buildStandings(fixtures) {
  const table = {};
  fixtures.filter(f => f.status === "finished").forEach(f => {
    const h = f.homeClubId, a = f.awayClubId;
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
  return { id, name: CLUBS[id].name, logo: CLUBS[id].logo, PJ:0,PG:0,PP:0,PF:0,PC:0,DG:0,PTS:0 };
}

function renderStandings(standings) {
  document.getElementById("standingsBody").innerHTML =
    standings.map((t,i)=>`
      <tr class="${i===0?"leader":""}">
        <td>${i+1}</td><td>${t.name}</td><td>${t.PJ}</td>
        <td>${t.PG}</td><td>${t.PP}</td><td>${t.PF}</td>
        <td>${t.PC}</td><td>${t.DG}</td><td>${t.PTS}</td>
      </tr>
    `).join("");
}
