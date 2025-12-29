const API_URL = import.meta?.env?.VITE_API_URL || "";

export async function getStandings() {
  const res = await fetch(`${API_URL}/api/standings/pre`);

  if (!res.ok) {
    throw new Error("Error API standings");
  }

  return await res.json();
}
