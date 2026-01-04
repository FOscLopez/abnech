const API_BASE = "https://abnech.onrender.com";

export async function getStandings() {
  const res = await fetch(`${API_BASE}/api/standings`);

  if (!res.ok) {
    throw new Error(`Backend error ${res.status}`);
  }

  return await res.json();
}
