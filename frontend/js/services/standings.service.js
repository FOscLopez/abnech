const API_BASE_URL = "https://abnech-basket.onrender.com";

export async function getStandings() {
  const res = await fetch(`${API_BASE_URL}/api/standings/pre`);

  if (!res.ok) {
    throw new Error(`Error backend: ${res.status}`);
  }

  const data = await res.json();
  return data;
}
