// CLUBES DINÁMICOS
const container = document.getElementById("clubs-container");

if (container && typeof clubs !== "undefined") {
  clubs.forEach(club => {
    const card = document.createElement("a");

    card.href = club.link;
    card.className = "club-card";

    card.innerHTML = `
      <img src="${club.img}">
      <p>${club.name}</p>
    `;

    container.appendChild(card);
  });
}