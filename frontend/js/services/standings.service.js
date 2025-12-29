export async function getStandings() {
  const API_URL = "https://abnech.onrender.com/api/standings/pre";

  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Error API standings");
  }

  return await res.json();
}
