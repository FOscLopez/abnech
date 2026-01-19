import { getFixtures } from "./services/fixtures.service.js";

/* ================== FIREBASE / ADMIN LINK ================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID"
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

/* ================== ESTADO ================== */
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
let visibleFixtures = [];
let expandedMatchId = null;
let currentCategory = "B1";

/* ================== INIT (EXPORT CORRECTO) ================== */
export async function initPublicPage() {
  populateClubFilter();
  bindFilters();

  restoreFromURL();
  restoreUIState();

  await loadCategory(currentCategory);
  restoreScroll();
}

/* ================== DEEP LINK ================== */
function restoreFromURL() {
  const params = new URLSearchParams(location.search);
  if (!params.size) return;

  currentCategory = params.get("cat") || currentCategory;
  expandedMatchId = params.get("expand");

  const r = document.getElementById("filter-round");
  const s = document.getElementById("filter-status");
  const c = document.getElementById("filter-club");

  if (r && params.get("round")) r.value = params.get("round");
  if (s && params.get("status")) s.value = params.get("status");
  if (c && params.get("club")) c.value = params.get("club");
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
  if (scroll) requestAnimationFrame(() => window.scrollTo(0, scroll));
}

/* ================== FILTROS ================== */
function populateClubFilter() {
  const select = document.getElementById("filter-club");
  if (!select) return;

  select.innerHTML = `<option value="all">Todos los clubes</option>`;
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

  if (r) filtered = filtered.filter(f => Number(f.round ?? f.order) === Number(r));
  if (s && s !== "all") filtered = filtered.filter(f => f.status === s);
  if (c && c !== "all") {
    filtered = filtered.filter(f => f.homeClubId === c || f.awayClubId === c);
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

/* ================== FIXTURE / TABLA ================== */
/* (resto de tu código exactamente igual, sin tocar) */
