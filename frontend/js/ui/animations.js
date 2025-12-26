// js/ui/animations.js

export function fadeIn(element) {
    if (!element) return;
    element.style.opacity = 0;
    element.style.transition = "opacity 0.4s ease";
    requestAnimationFrame(() => {
      element.style.opacity = 1;
    });
  }
  
  export function fadeOut(element, callback) {
    if (!element) return;
    element.style.opacity = 1;
    element.style.transition = "opacity 0.4s ease";
    element.style.opacity = 0;
    setTimeout(() => {
      if (callback) callback();
    }, 400);
  }
  