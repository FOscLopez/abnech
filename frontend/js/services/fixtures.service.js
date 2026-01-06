const API_BASE = "https://abnech.onrender.com";

const CLUBS_MAP = {
  union: {
    name: "Unión",
    logo: "/img/clubs/union.png",
  },
  funebrero: {
    name: "Funebrero",
    logo: "/img/clubs/palermo.png",
  },
  cfa: {
    name: "CFA",
    logo: "/img/clubs/cfa.png",
  },
  "general-vedia": {
    name: "General Vedia",
    logo: "/img/clubs/general-vedia.png",
  },
  "la-leonesa": {
    name: "La Leonesa",
    logo: "/img/clubs/la-leonesa.png",
  },
  "palermo-cap": {
    name: "Palermo CAP",
    logo: "/img/clubs/palermo-cap.png",
  },
  "puerto-bermejo": {
    name: "Puerto Bermejo",
    logo: "/img/clubs/puerto-bermejo.png",
  },
  zapallar: {
    name: "Zapallar",
    logo: "/img/clubs/zapallar.png",
  },
};

export async function getFixturesByCategory(categoryId) {
  const res = await fetch(`${API_BASE}/api/fixtures/${categoryId}`);

  if (!res.ok) {
    throw new Error("Error cargando fixtures");
  }

  return await res.json();
}
