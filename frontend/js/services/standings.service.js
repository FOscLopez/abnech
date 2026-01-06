const BASE_URL = "https://abnech.onrender.com";

export async function getStandings(categoryId) {
  const res = await fetch(`${BASE_URL}/api/standings/${categoryId}`);
  if (!res.ok) throw new Error("Backend error");
  return res.json();
}
