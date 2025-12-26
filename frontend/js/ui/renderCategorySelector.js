// js/ui/renderCategorySelector.js

import { categoriesData } from "../data/categories.data.js";
import { setCurrentCategory, getCurrentCategory } from "../services/category.service.js";
import { renderFixture } from "./renderFixture.js";

export function renderCategorySelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  categoriesData.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;

    if (cat === getCurrentCategory()) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      setCurrentCategory(cat);
      renderCategorySelector(containerId); // refresca estilos
      renderFixture("fixture-grid");
    });

    container.appendChild(btn);
  });
}
