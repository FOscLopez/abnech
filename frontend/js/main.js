document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("clubs-container");
  const track = document.getElementById("clubs-track");
  const header = document.querySelector(".header");
  const links = document.querySelectorAll(".nav a");

  if (!window.clubs) {
    console.error("clubs.js no cargó");
    return;
  }

  // =========================
  // HERO ANIMACIÓN ENTRADA
  // =========================

  const hero = document.querySelector(".hero");
  setTimeout(() => {
    hero.classList.add("loaded");
  }, 200);

  // =========================
  // HEADER DINÁMICO (SCROLL)
  // =========================

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // =========================
  // INDICADOR ACTIVO (NAV)
  // =========================

  const indicator = document.createElement("span");
  indicator.classList.add("nav-indicator");
  document.querySelector(".nav").appendChild(indicator);

  function moveIndicator(el) {
    indicator.style.width = el.offsetWidth + "px";
    indicator.style.left = el.offsetLeft + "px";
  }

  // click
  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
    });
  });

  // inicial
  if (links[0]) {
    links[0].classList.add("active");
    moveIndicator(links[0]);
  }

  // =========================
  // SCROLL DETECTOR SECCIONES
  // =========================

  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute("id");
      }
    });

    links.forEach(link => {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
        moveIndicator(link);
      }
    });
  });

  // =========================
  // SCROLL SUAVE
  // =========================

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // =========================
  // MODAL PRO
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

      card.addEventListener("click", (e) => {
        e.preventDefault();

        document.getElementById("modal-logo").src = club.img;
        document.getElementById("modal-name").innerText = club.name;
        document.getElementById("modal-city").innerText = club.city || "No disponible";
        document.getElementById("modal-year").innerText = club.year || "-";
        document.getElementById("modal-stadium").innerText = club.stadium || "-";

        modal.classList.add("active");
      });

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

  // =========================
  // CERRAR MODAL
  // =========================

  modal.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("club-modal") ||
      e.target.classList.contains("modal-close")
    ) {
      modal.classList.remove("active");
    }
  });

});