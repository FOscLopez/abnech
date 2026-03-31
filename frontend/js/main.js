document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("clubs-container");
  const track = document.getElementById("clubs-track");
  const header = document.querySelector(".header");
  const links = document.querySelectorAll(".nav a");

  // =========================
  // LOADER
  // =========================

  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader.classList.add("hidden"), 800);
  });

  // =========================
  // HEADER SCROLL
  // =========================

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // =========================
  // NAV INDICATOR
  // =========================

  const indicator = document.createElement("span");
  indicator.classList.add("nav-indicator");
  document.querySelector(".nav").appendChild(indicator);

  function moveIndicator(el) {
    indicator.style.width = el.offsetWidth + "px";
    indicator.style.left = el.offsetLeft + "px";
  }

  if (links[0]) moveIndicator(links[0]);

  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
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
  // SCROLL REVEAL (APP STYLE)
  // =========================

  const sections = document.querySelectorAll("section");

  function reveal() {
    const trigger = window.innerHeight * 0.85;

    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < trigger) sec.classList.add("visible");
    });
  }

  window.addEventListener("scroll", reveal);
  reveal();

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

      const name = document.createElement("p");
      name.textContent = club.name;

      card.appendChild(img);
      card.appendChild(name);

      // 🔥 GLOW DINÁMICO
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--x", x + "px");
        card.style.setProperty("--y", y + "px");
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

});