document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // SLIDER
  // =========================
  const slides = document.querySelectorAll(".slide");
  let index = 0;

  if (slides.length) {
    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, 4000);
  }

  // =========================
  // PARTICULAS
  // =========================
  const canvas = document.getElementById("particles");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2,
      d: Math.random()
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255,255,255,0.05)";
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.d;
        if (p.y > canvas.height) p.y = 0;
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  // =========================
  // CLUBES DINÁMICOS
  // =========================
  const container = document.getElementById("clubs-container");
  const track = document.getElementById("clubs-track");

  if (container && typeof clubs !== "undefined") {
    clubs.forEach(club => {
      const card = document.createElement("a");

      card.href = club.link;
      card.className = "club-card";

      card.innerHTML = `
        <img src="${club.img}" loading="lazy">
        <p>${club.name}</p>
      `;

      container.appendChild(card);
    });
  }

  // banner dinámico
  if (track && typeof clubs !== "undefined") {
    const duplicated = [...clubs, ...clubs];

    duplicated.forEach(club => {
      const img = document.createElement("img");
      img.src = club.img;
      track.appendChild(img);
    });
  }

  // =========================
  // NAVBAR SCROLL
  // =========================
  const header = document.querySelector(".main-header-pro");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // =========================
  // SCROLL REVEAL
  // =========================
  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    const trigger = window.innerHeight * 0.85;

    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // =========================
  // HERO LOAD ANIMATION
  // =========================
  setTimeout(() => {
    document.querySelector(".hero")?.classList.add("loaded");
  }, 200);

});