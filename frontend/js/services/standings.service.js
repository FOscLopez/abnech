const API_URL = "https://abnech.onrender.com";

export async function getStandings() {
  const response = await fetch(`${API_URL}/api/standings/pre`);

  if (!response.ok) {
    throw new Error("Error API standings");
  }

  return response.json();
}
