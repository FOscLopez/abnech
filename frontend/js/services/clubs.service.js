import { API_BASE } from "../config.js";

export async function getClubsFromApi() {
  const res = await fetch(`${API_BASE}api/clubs`);

  if (!res.ok) {
    throw new Error("Error al obtener clubs desde API");
  }

  return await res.json();
}
