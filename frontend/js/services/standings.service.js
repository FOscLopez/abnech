export async function getStandings() {
  const res = await fetch("/api/standings/pre");

  if (!res.ok) {
    throw new Error("Error API standings");
  }

  const data = await res.json();

  // 🔒 Seguridad: la API devuelve array
  if (!Array.isArray(data)) {
    throw new Error("Formato de standings inválido");
  }

  return data;
}
