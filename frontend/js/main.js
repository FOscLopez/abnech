document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("clubs-container");
    const track = document.getElementById("clubs-track");
  
    if (!window.clubs) {
      console.error("clubs.js no cargó");
      return;
    }
  
    // =========================
    // CLUBES
    // =========================
  
    if (container) {
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
  
        container.appendChild(card);
      });
    }
  
    // =========================
    // BANNER
    // =========================
  
    if (track) {
      track.innerHTML = "";
  
      const duplicated = [...window.clubs, ...window.clubs];
  
      duplicated.forEach(club => {
        const img = document.createElement("img");
        img.src = club.img;
        track.appendChild(img);
      });
    }
  
  });