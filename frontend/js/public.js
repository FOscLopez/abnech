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
   STICKY NAV (PERFORMANCE)
========================= */
let lastScroll = 0;
window.addEventListener(
  "scroll",
  () => {
    requestAnimationFrame(() => {
      const header = document.querySelector(".site-header");
      if (!header) return;

      const scrolled = window.scrollY > 20;
      header.classList.toggle("is-sticky", scrolled);
    });
  },
  { passive: true }
);

/* =========================
   FIXTURE
========================= */
function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  if (!grid) return;

  grid.innerHTML = "";

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
   STANDINGS (FLIP SORT)
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

/* =========================
   FLIP ANIMATION
========================= */
function animateTable(tbody, newRowsHTML) {
  const oldRects = {};
  [...tbody.children].forEach(row => {
    oldRects[row.dataset.id] = row.getBoundingClientRect();
  });

  tbody.innerHTML = newRowsHTML;

  [...tbody.children].forEach(row => {
    const old = oldRects[row.dataset.id];
    if (!old) return;

    const newRect = row.getBoundingClientRect();
    const dy = old.top - newRect.top;

    row.style.transform = `translateY(${dy}px)`;
    row.style.transition = "none";

    requestAnimationFrame(() => {
      row.style.transform = "";
      row.style.transition = "transform 0.35s ease";
    });
  });
}

function renderStandings(standings) {
  const tbody = document.getElementById("standingsBody");
  if (!tbody) return;

  const rows = standings
    .map(
      (t, i) => `
      <tr data-id="${t.id}" class="${i === 0 ? "leader" : ""}">
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
      </tr>`
    )
    .join("");

  animateTable(tbody, rows);
}

/* =========================
   CATEGORÍA
========================= */
async function loadCategory(category) {
  currentCategory = category;

  const content = document.querySelector(".content-area");
  content?.classList.add("fade-out");

  setTimeout(async () => {
    const fixtures = await getFixtures(category);
    renderFixtures(fixtures);
    renderStandings(buildStandings(fixtures));
    content?.classList.remove("fade-out");
  }, 200);
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
