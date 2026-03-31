document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("clubs-container");
  const track = document.getElementById("clubs-track");

  if (!window.clubs) {
    console.error("clubs.js no cargó");
    return;
  }

  // CLUBES
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

  // BANNER
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

  // =========================
  // 🔥 FIX REVEAL (ESTE ES EL PROBLEMA)
  // =========================

  const reveals = document.querySelectorAll(".reveal");

  function revealOnScroll() {
    const trigger = window.innerHeight * 0.9;

    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;

      if (top < trigger) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // 👈 CLAVE
});
// HERO LOAD ANIMATION (SAFE)
window.addEventListener("load", () => {
  const hero = document.getElementById("hero");
  if(hero){
    setTimeout(() => hero.classList.add("loaded"), 100);
  }
});
// SCROLL REVEAL SAFE
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
  const trigger = window.innerHeight * 0.9;

  reveals.forEach(el=>{
    const top = el.getBoundingClientRect().top;
    if(top < trigger){
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
// ACTIVE SECTION (APP FEEL)
const sections = document.querySelectorAll("section");

function updateActiveSection(){
  let current = null;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();

    if(rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.3){
      current = section;
    }
  });

  sections.forEach(sec => sec.classList.remove("active-section"));

  if(current){
    current.classList.add("active-section");
  }
}

window.addEventListener("scroll", updateActiveSection);
window.addEventListener("load", updateActiveSection);