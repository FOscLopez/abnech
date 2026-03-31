// =========================
// MODAL CLUB PRO
// =========================

const modal = document.createElement("div");
modal.className = "club-modal";

modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>

    <div class="modal-header">
      <img id="modal-logo">
      <h2 id="modal-name"></h2>
    </div>

    <div class="modal-body">
      <p><strong>Ciudad:</strong> <span id="modal-city"></span></p>
      <p><strong>Fundación:</strong> <span id="modal-year"></span></p>
      <p><strong>Estadio:</strong> <span id="modal-stadium"></span></p>
    </div>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // CLUBES GRID
  // =========================
  const container = document.getElementById("clubs-container");

if (container && window.clubs) {
  container.innerHTML = "";

  window.clubs.forEach(club => {
    const card = document.createElement("a");
    card.href = club.link;
    card.className = "club-card";

    const img = document.createElement("img");
    img.src = club.img;

    // 🔥 FIX: evita romper si imagen falla
    img.onerror = () => {
      img.src = "./img/clubs/default.png"; // poné un placeholder
    };

    const name = document.createElement("p");
    name.textContent = club.name;

    card.appendChild(img);
    card.appendChild(name);

    container.appendChild(card);
  });
}

  // =========================
  // BANNER (IMPORTANTE)
  // =========================
  const track = document.querySelector(".clubs-track");

  if (track && window.clubs) {
    track.innerHTML = "";

    const duplicated = [...window.clubs, ...window.clubs];

    duplicated.forEach(club => {
      const img = document.createElement("img");
      img.src = club.img;
      track.appendChild(img);
    });
  }

});

// =========================
// ACTIVAR DESDE CLUBES
// =========================

document.addEventListener("click", (e) => {
  const card = e.target.closest(".club-card");
  if (!card) return;

  e.preventDefault();

  const club = clubs.find(c => c.name === card.innerText.trim());

  if (!club) return;

  document.getElementById("modal-logo").src = club.img;
  document.getElementById("modal-name").innerText = club.name;
  document.getElementById("modal-city").innerText = club.city || "N/A";
  document.getElementById("modal-year").innerText = club.year || "N/A";
  document.getElementById("modal-stadium").innerText = club.stadium || "N/A";

  modal.classList.add("active");
});