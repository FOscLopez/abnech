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

document.body.appendChild(modal);

const closeBtn = modal.querySelector(".modal-close");

// cerrar modal
closeBtn.onclick = () => modal.classList.remove("active");

window.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("active");
};

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