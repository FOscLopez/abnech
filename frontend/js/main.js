// HEADER SCROLL
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// NAV INDICATOR
const links = document.querySelectorAll(".nav a");
const indicator = document.querySelector(".nav-indicator");

function moveIndicator(el){
  indicator.style.width = el.offsetWidth + "px";
  indicator.style.left = el.offsetLeft + "px";
}

links.forEach(link=>{
  link.addEventListener("click",()=>{
    links.forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(link);
  });
});

moveIndicator(links[0]);

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");

function reveal(){
  const trigger = window.innerHeight * 0.85;

  reveals.forEach(el=>{
    if(el.getBoundingClientRect().top < trigger){
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);