const API_BASE = "https://abnech.onrender.com";

export async function getStandings() {
  const res = await fetch("/api/standings/pre");

  if (!res.ok) {
    throw new Error("Error al obtener standings");
  }

  return await res.json();
}
