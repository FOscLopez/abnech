const BASE_URL = "https://abnech.onrender.com";

export async function getFixtures(categoryId) {
  const res = await fetch(`${BASE_URL}/api/fixtures/${categoryId}`);

  if (!res.ok) {
    throw new Error("Error obteniendo fixtures");
  }

  return res.json();
}