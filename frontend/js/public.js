import { getFixtures } from "./services/fixtures.service.js";

/* ================== FIREBASE / ADMIN LINK ================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0ypWFEhPWu2jiyTZoW3fd9SPes3wcBdc",
  authDomain: "abnech-basket.firebaseapp.com",
  projectId: "abnech-basket",
  storageBucket: "abnech-basket.firebasestorage.app",
  messagingSenderId: "1020692623846",
  appId: "1:1020692623846:web:a1b37421b2e891b52b6627",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const adminLink = document.getElementById("adminLink");

onAuthStateChanged(auth, user => {
  if (!adminLink) return;

  if (
    user &&
    (user.email === "admin@abnech.com" || user.email === "editor@abnech.com")
  ) {
    adminLink.style.display = "inline-block";
  } else {
    adminLink.style.display = "none";
  }
});

/* ================== CLUBES ================== */

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

/* ================== ESTADO ================== */

const STORAGE_KEY = "abnech_ui_state";

let allFixtures = [];
let visibleFixtures = [];
let expandedMatchId = null;
let currentCategory = "B1";

/* ================== INIT ================== */

export async function initPublicPage() {
  populateClubFilter();
  bindFilters();
  restoreFromURL();
  restoreUIState();
  await loadCategory(currentCategory);
  restoreScroll();
}

/* ================== URL ================== */

function restoreFromURL() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return;

  currentCategory = params.get("cat") || currentCategory;
  expandedMatchId = params.get("expand");
}

/* ================== PERSISTENCIA ================== */

function saveUIState() {
  const r = document.getElementById("filter-round");
  const s = document.getElementById("filter-status");
  const c = document.getElementById("filter-club");

  const state = {
    category: currentCategory,
    round: r?.value || "",
    status: s?.value || "all",
    club: c?.value || "all",
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
}

function restoreScroll() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const { scroll } = JSON.parse(raw);

  if (scroll) {
    requestAnimationFrame(() => window.scrollTo(0, scroll));
  }
}

/* ================== FILTROS ================== */

function populateClubFilter() {
  const select = document.getElementById("filter-club");
  if (!select) return;

  select.innerHTML = `<option value="all">Todos</option>`;

  Object.entries(CLUBS).forEach(([id, club]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = club.name;
    select.appendChild(opt);
  });
}

function bindFilters() {
  ["filter-round", "filter-status", "filter-club"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      expandedMatchId = null;
      applyFilters();
      saveUIState();
    });
  });

  window.addEventListener("scroll", () => saveUIState(), { passive: true });
}

function applyFilters() {
  let filtered = [...allFixtures];

  const r = document.getElementById("filter-round")?.value;
  const s = document.getElementById("filter-status")?.value;
  const c = document.getElementById("filter-club")?.value;

  if (r) {
    filtered = filtered.filter(
      f => Number(f.round ?? f.order) === Number(r)
    );
  }

  if (s && s !== "all") {
    filtered = filtered.filter(f => f.status === s);
  }

  if (c && c !== "all") {
    filtered = filtered.filter(
      f => f.homeClubId === c || f.awayClubId === c
    );
  }

  visibleFixtures = filtered;

  renderFixtures(visibleFixtures);
}

/* ================== DATA ================== */

async function loadCategory(category) {
  allFixtures = await getFixtures(category);

  visibleFixtures = [...allFixtures];

  applyFilters();

  renderStandings(buildStandings(allFixtures));
}

/* ================== FIXTURE ================== */

function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = fixtures.length
    ? fixtures.map(f => {

        const home = CLUBS[f.homeClubId];
        const away = CLUBS[f.awayClubId];

        if (!home || !away) return "";

        const open = expandedMatchId === f.id;

        return `
          <div class="fixture-card ${open ? "open" : ""}" data-id="${f.id}">

            <div class="fixture-main">

              <div class="team">

                <img src="${home.logo}"
                     alt="${home.name}"
                     onerror="this.style.display='none'">

                <span>${home.name}</span>

              </div>

              <div class="score">
                ${f.scoreLocal ?? "-"} - ${f.scoreAway ?? "-"}
              </div>

              <div class="team">

                <img src="${away.logo}"
                     alt="${away.name}"
                     onerror="this.style.display='none'">

                <span>${away.name}</span>

              </div>

            </div>

            ${open ? renderDetails(f) : ""}

          </div>
        `;
      }).join("")
    : `<div class="empty-state">Sin resultados</div>`;

  document.querySelectorAll(".fixture-card").forEach(card => {
    card.addEventListener("click", () => {

      expandedMatchId =
        expandedMatchId === card.dataset.id
          ? null
          : card.dataset.id;

      renderFixtures(visibleFixtures);

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

  fixtures
    .filter(f => f.status === "finished" || f.status === "Finalizado")
    .forEach(f => {

      const h = f.homeClubId;
      const a = f.awayClubId;

      if (!CLUBS[h] || !CLUBS[a]) return;

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
        table[h].PTS += 2;

        table[a].PP++;
        table[a].PTS += 1;

      } else {

        table[a].PG++;
        table[a].PTS += 2;

        table[h].PP++;
        table[h].PTS += 1;
      }
    });

  return Object.values(table)
    .map(t => ({ ...t, DG: t.PF - t.PC }))
    .sort((a, b) => b.PTS - a.PTS || b.DG - a.DG);
}

function baseTeam(id) {

  const club = CLUBS[id];

  return {
    id,
    name: club ? club.name : id,
    logo: club ? club.logo : "",
    PJ:0, PG:0, PP:0, PF:0, PC:0, DG:0, PTS:0
  };
}

/* ================== STATS ================== */

function renderStatsSummary(standings) {
  if (!standings.length) return;

  const games = standings.reduce((a, t) => a + t.PJ, 0) / 2;

  const leader = standings[0];

  let bestAttack = standings[0];
  let bestDefense = standings[0];

  standings.forEach(t => {

    if (!t.PJ) return;

    if (t.PF / t.PJ > bestAttack.PF / bestAttack.PJ) {
      bestAttack = t;
    }

    if (t.PC / t.PJ < bestDefense.PC / bestDefense.PJ) {
      bestDefense = t;
    }
  });

  setText("stat-games", games);
  setText("stat-leader", leader.name);
  setText("stat-attack", `${bestAttack.name} (${(bestAttack.PF / bestAttack.PJ).toFixed(1)})`);
  setText("stat-defense", `${bestDefense.name} (${(bestDefense.PC / bestDefense.PJ).toFixed(1)})`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderStandings(standings) {

  renderStatsSummary(standings);

  document.getElementById("standingsBody").innerHTML =
    standings.map((t,i)=>`
      <tr class="${i===0?"leader":""}">

        <td>${i+1}</td>
        <td>${t.name}</td>
        <td>${t.PJ}</td>
        <td>${t.PG}</td>
        <td>${t.PP}</td>
        <td>${t.PF}</td>
        <td>${t.PC}</td>
        <td>${t.DG}</td>
        <td>${t.PTS}</td>

      </tr>
    `).join("");
}
