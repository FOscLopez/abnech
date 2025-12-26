import { clubsData } from "../data/clubs.data.js";

export function renderClubs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  clubsData.forEach(club => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.innerHTML = `
      <img src="${club.logo}" class="club-logo" alt="${club.nombre}">
      <h3>${club.nombre}</h3>
      <p>${club.ciudad}</p>
    `;
    container.appendChild(card);
  });
}
