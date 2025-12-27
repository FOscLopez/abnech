import { API_BASE } from "../config.js";

export async function getStandings() {
  const response = await fetch(`${API_BASE}/api/standings`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Error API standings: " + text);
  }

  return await response.json();
}
