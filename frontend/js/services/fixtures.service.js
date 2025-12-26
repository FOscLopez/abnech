import { API_BASE } from "../config.js";

export async function getFixturesFromApi() {
  const res = await fetch(`${API_BASE}api/fixtures`);

  if (!res.ok) {
    throw new Error("Error al obtener fixtures desde API");
  }

  return await res.json();
}
