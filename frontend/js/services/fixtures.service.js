const API_BASE = "https://abnech.onrender.com";

export async function getFixturesByCategory(categoryId) {
  const res = await fetch(`${API_BASE}/api/fixtures/${categoryId}`);

  if (!res.ok) {
    throw new Error("Error cargando fixtures");
  }

  return await res.json();
}
