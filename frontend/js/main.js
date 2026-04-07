document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  window.addEventListener("load", () => {
    setTimeout(() => {
      hero.classList.add("loaded");
    }, 300);
  });
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
// 🎯 SECCIÓN ACTIVA (FOCUS)
// =========================

const sections = document.querySelectorAll("section");

function updateActiveSection() {
  let currentSection = null;
  let closestOffset = Infinity;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const offset = Math.abs(rect.top);

    if (rect.top <= window.innerHeight * 0.4 && offset < closestOffset) {
      currentSection = section;
      closestOffset = offset;
    }
  });

  sections.forEach(sec => {
    sec.classList.remove("active-section", "inactive");

    if (sec === currentSection) {
      sec.classList.add("active-section");
    } else {
      sec.classList.add("inactive");
    }
  });
}

window.addEventListener("scroll", updateActiveSection);
updateActiveSection();


// =========================
// 🌌 PARALLAX HERO
// =========================

const logo = document.querySelector(".hero-logo img");
const text = document.querySelector(".hero-text");

hero.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  logo.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  text.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
});

hero.addEventListener("mouseleave", () => {
  logo.style.transform = "";
  text.style.transform = "";
});

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
// =========================
// 🎬 LOADER APP
// =========================

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 800);
});


// =========================
// 🎯 SECCIÓN ACTIVA PRO
// =========================

const sections = document.querySelectorAll("section");

function updateActiveSection() {
  let current = null;
  let closest = Infinity;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const offset = Math.abs(rect.top);

    if (rect.top <= window.innerHeight * 0.4 && offset < closest) {
      current = section;
      closest = offset;
    }
  });

  sections.forEach(sec => {
    sec.classList.remove("active-section");

    if (sec === current) {
      sec.classList.add("active-section");
    }
  });
}

window.addEventListener("scroll", updateActiveSection);
updateActiveSection();


// =========================
// 🔥 NAV INDICATOR REAL
// =========================

const links = document.querySelectorAll(".nav a");
const indicator = document.querySelector(".nav-indicator");

function moveIndicator(el){
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

// init
if(links[0]){
  moveIndicator(links[0]);
}
// =========================
// 📲 PWA REGISTER
// =========================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("PWA activa"))
      .catch(err => console.log("Error SW:", err));
  });
}
// =========================
// 📊 TABLA AUTOMÁTICA
// =========================

function generarTabla(){
  if(!window.clubs || !window.matches) return;

  const stats = {};

  // inicializar
  clubs.forEach(c => {
    stats[c.name] = { pts:0, pg:0, pp:0 };
  });

  // procesar partidos
  matches.forEach(m => {
    if(m.homeScore > m.awayScore){
      stats[m.home].pts += 2;
      stats[m.home].pg += 1;
      stats[m.away].pp += 1;
    } else {
      stats[m.away].pts += 2;
      stats[m.away].pg += 1;
      stats[m.home].pp += 1;
    }
  });

  // ordenar
  const sorted = Object.entries(stats).sort((a,b)=> b[1].pts - a[1].pts);

  const tbody = document.getElementById("tabla-body");
  if(!tbody) return;

  tbody.innerHTML = "";

  sorted.forEach(([name,data])=>{
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${name}</td>
      <td>${data.pts}</td>
      <td>${data.pg}</td>
      <td>${data.pp}</td>
    `;

    tbody.appendChild(tr);
  });
}

generarTabla();
// =========================
// 🔔 NOTIFICACIONES
// =========================

function pedirPermisoNoti(){
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(permission => {
    if(permission === "granted"){
      console.log("Notificaciones activadas");
    }
  });
}

// ejemplo de uso
function notificar(titulo, mensaje){
  if(Notification.permission === "granted"){
    new Notification(titulo, {
      body: mensaje,
      icon: "./img/logo-abnech.png"
    });
  }
}

// activar al entrar
pedirPermisoNoti();

// 🔥 TEST (podés borrar después)
setTimeout(()=>{
  notificar("ABNECH Basket", "Nueva fecha cargada 🏀");
}, 5000);
const canvas = document.getElementById("energyCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 360;

let particles = [];

// crear partículas
for (let i = 0; i < 40; i++) {
  particles.push({
    angle: Math.random() * Math.PI * 2,
    radius: 140 + Math.random() * 10,
    speed: 0.01 + Math.random() * 0.02,
    size: 2 + Math.random() * 2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  particles.forEach(p => {

    p.angle += p.speed;

    const x = centerX + Math.cos(p.angle) * p.radius;
    const y = centerY + Math.sin(p.angle) * p.radius;

    // glow
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,140,0,0.8)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "orange";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
canvas.addEventListener("mousemove", () => {
  particles.forEach(p => p.speed += 0.002);
});

canvas.addEventListener("mouseleave", () => {
  particles.forEach(p => p.speed = 0.02);
});