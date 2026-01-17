import { getFixtures } from "./services/fixtures.service.js";

const CLUBS = {
  union: { name: "Unión", logo: "/img/clubs/union.png" },
  funebrero: { name: "Funebrero", logo: "/img/clubs/funebrero.png" }
};

let state = {
  cat: "B1",
  round: "",
  status: "all",
  club: "all",
  expanded: null,
  scroll: 0
};

const qs = new URLSearchParams(location.search);
state = { ...state, Object.fromEntries(qs.entries()) };

function syncURL() {
  const p = new URLSearchParams(state);
  history.replaceState(null, "", "?" + p.toString());
}

function renderFixtures(fixtures) {
  const grid = document.getElementById("fixture-grid");
  grid.innerHTML = "";

  fixtures.forEach((f, i) => {
    const open = state.expanded == i;
    grid.innerHTML += `
      <div class="fixture-card" data-i="${i}">
        <div>${CLUBS[f.homeClubId].name} ${f.scoreLocal} - ${f.scoreAway} ${CLUBS[f.awayClubId].name}</div>
        ${open ? `<div class="fixture-detail">Jornada ${f.round || "-"}</div>` : ""}
      </div>
    `;
  });

  document.querySelectorAll(".fixture-card").forEach(card => {
    card.onclick = () => {
      state.expanded = state.expanded == card.dataset.i ? null : card.dataset.i;
      syncURL();
      renderFixtures(fixtures);
    };
  });
}

export async function initPublicPage() {
  const fixtures = await getFixtures(state.cat);
  renderFixtures(fixtures);
  syncURL();
}
