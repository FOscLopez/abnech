// js/services/category.service.js

let currentCategory = "Primera";

export function getCurrentCategory() {
  return currentCategory;
}

export function setCurrentCategory(category) {
  currentCategory = category;
}
