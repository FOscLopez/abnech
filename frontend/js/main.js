// SLIDER
let slides = document.querySelectorAll(".slide");
let index = 0;

setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 4000);

// PARTICULAS SIMPLE
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for(let i=0;i<60;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*2,
    d: Math.random()*1
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle="rgba(255,255,255,0.05)";
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });

  update();
}

function update(){
  particles.forEach(p=>{
    p.y += p.d;
    if(p.y > canvas.height){
      p.y = 0;
    }
  });
}

setInterval(draw,33);

// =========================
// GENERAR CLUBES DINÁMICOS
// =========================

const container = document.getElementById("clubs-container");

if (container) {
  clubs.forEach(club => {
    const card = document.createElement("a");

    card.href = club.link;
    card.className = "club-card";

    card.innerHTML = `
      <img src="${club.img}" alt="${club.name}">
      <p>${club.name}</p>
    `;

    container.appendChild(card);
  });
}

const track = document.getElementById("clubs-track");

if (track) {
  const duplicated = [...clubs, ...clubs];

  duplicated.forEach(club => {
    const img = document.createElement("img");
    img.src = club.img;
    track.appendChild(img);
  });
}
const logo = document.querySelector(".logo-elite img");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX / window.innerWidth;
  const glow = 10 + x * 20;

  logo.style.filter = `drop-shadow(0 0 ${glow}px rgba(255,140,0,0.9))`;
});
const header = document.querySelector(".main-header-pro");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
// =========================
// SCROLL SUAVE
// =========================
document.querySelectorAll('.header-nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute('href'));

    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});


// =========================
// INDICADOR DINÁMICO
// =========================
const links = document.querySelectorAll('.header-nav a');
const indicator = document.querySelector('.nav-indicator');

function moveIndicator(el) {
  indicator.style.width = el.offsetWidth + "px";
  indicator.style.left = el.offsetLeft + "px";
}

// click activo
links.forEach(link => {
  link.addEventListener('click', () => {
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    moveIndicator(link);
  });
});

// inicial
if (links[0]) {
  links[0].classList.add('active');
  moveIndicator(links[0]);
}


// =========================
// SCROLL DETECTOR (PRO)
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
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero");

  setTimeout(() => {
    hero.classList.add("loaded");
  }, 200);
});
// =========================
// SCROLL REVEAL PRO
// =========================

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < triggerBottom) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// micro feedback global
document.querySelectorAll("a, button, .club-card").forEach(el => {
  el.addEventListener("click", () => {
    el.style.transform += " scale(0.96)";
    setTimeout(() => {
      el.style.transform = "";
    }, 120);
  });
});