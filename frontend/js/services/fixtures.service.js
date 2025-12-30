const API_URL = "https://abnech.onrender.com/api/fixtures";

export async function getFixtures() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error(`Error backend ${res.status}`);
  }

  return await res.json();
}
