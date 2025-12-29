export async function getStandings() {
  const res = await fetch("/api/standings/pre");

  if (!res.ok) {
    throw new Error("Error API standings");
  }

  return res.json();
}
