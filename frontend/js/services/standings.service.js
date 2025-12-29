export async function getStandings() {
  const response = await fetch("/api/standings/pre");

  if (!response.ok) {
    throw new Error("Error API standings");
  }

  return await response.json();
}
