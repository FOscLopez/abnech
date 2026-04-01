const BASE_URL = "https://abnech.onrender.com";

// 🔥 MODO: cambiar a true cuando uses Firebase
const USE_FIREBASE = false;

// 🔥 IMPORT dinámico (solo si lo usamos)
let db = null;

async function initFirebase() {
  if (!db) {
    const { db: firestoreDB } = await import("./firebase.js");
    db = firestoreDB;
  }
}

// =========================
// 📊 GET FIXTURES
// =========================

export async function getFixtures(categoryId) {

  // 🔥 SI USAMOS FIREBASE
  if (USE_FIREBASE) {
    try {
      await initFirebase();

      const snapshot = await db.collection("fixtures")
        .where("categoryId", "==", categoryId)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error("Firebase error, fallback a API", error);
    }
  }

  // 🔥 FALLBACK (TU BACKEND ACTUAL)
  const res = await fetch(`${BASE_URL}/api/fixtures/${categoryId}`);

  if (!res.ok) {
    throw new Error("Error obteniendo fixtures");
  }

  return res.json();
}