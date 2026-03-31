document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("clubs-container");
    const track = document.getElementById("clubs-track");
  
    // =========================
    // MODAL
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
  
    // =========================
    // CLUBES
    // =========================
  
    if (container && window.clubs) {
  
      container.innerHTML = "";
  
      window.clubs.forEach(club => {
  
        const card = document.createElement("a");
        card.className = "club-card";
        card.href = "#";
  
        const img = document.createElement("img");
        img.src = club.img;
  
        img.onerror = () => img.remove();
  
        const name = document.createElement("p");
        name.textContent = club.name;
  
        card.appendChild(img);
        card.appendChild(name);
  
        card.addEventListener("click", (e) => {
          e.preventDefault();
  
          document.getElementById("modal-logo").src = club.img;
          document.getElementById("modal-name").innerText = club.name;
          document.getElementById("modal-city").innerText = club.city || "N/A";
          document.getElementById("modal-year").innerText = club.year || "N/A";
          document.getElementById("modal-stadium").innerText = club.stadium || "N/A";
  
          modal.classList.add("active");
        });
  
        container.appendChild(card);
      });
    }
  
    // =========================
    // BANNER
    // =========================
  
    if (track && window.clubs) {
      track.innerHTML = "";
  
      const duplicated = [...window.clubs, ...window.clubs];
  
      duplicated.forEach(club => {
        const img = document.createElement("img");
        img.src = club.img;
        track.appendChild(img);
      });
    }
  
    // cerrar modal
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("club-modal") || e.target.classList.contains("modal-close")) {
        modal.classList.remove("active");
      }
    });
  
  });