// SLIDER SIMPLE (si querés mantenerlo después lo reactivamos)
const slides = document.querySelectorAll(".slide");
let index = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 4000);
}

// GENERAR CLUBES
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