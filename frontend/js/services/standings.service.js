const API_URL = "https://abnech-basket.onrender.com/api/standings/pre";

export async function getStandings() {
  const res = await fetch(API_URL);

  // 🔴 SI NO ES JSON, CORTAMOS ACÁ
  if (!res.ok) {
    throw new Error(`Backend error ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Respuesta inválida del backend");
  }

  return await res.json();
}
