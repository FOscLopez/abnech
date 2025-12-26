import { API_BASE } from "../config.js";

export async function getStandings() {
  const res = await fetch(`${API_BASE}/api/standings`);
  return await res.json();
}
