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