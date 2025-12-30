export async function getStandings() {
  const response = await fetch("/api/standings/pre");

  if (!response.ok) {
    const text = await response.text();
    console.error("Respuesta inválida del backend:", response.status, text);
    throw new Error("Error al obtener standings");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Formato inválido de standings:", data);
    throw new Error("Standings no es un array");
  }

  return data;
}
