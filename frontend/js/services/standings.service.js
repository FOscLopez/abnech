const API_URL = import.meta.env.VITE_API_URL;

export async function getStandings() {
  const response = await fetch(`${API_URL}/api/standings/pre`);

  if (!response.ok) {
    throw new Error("Error API standings");
  }

  return response.json();
}
