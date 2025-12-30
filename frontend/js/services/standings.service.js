export async function getStandings() {
  const response = await fetch("/api/standings/pre", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Respuesta inválida del servidor");
  }

  return data;
}
