const BASE_URL = "https://abnech.onrender.com";

// 🔥 activar cuando migremos
const USE_FIREBASE = false;

let db = null;

async function initFirebase() {
  if (!db) {
    const { db: firestoreDB } = await import("./firebase.js");
    db = firestoreDB;
  }
}

// =========================
// 📊 GET STANDINGS
// =========================

export async function getStandings(categoryId) {

  // 🔥 FIREBASE MODE
  if (USE_FIREBASE) {
    try {
      await initFirebase();

      const snapshot = await db.collection("standings")
        .where("categoryId", "==", categoryId)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error("Firebase error, fallback API", error);
    }
  }

  // 🔥 BACKEND ACTUAL (SE MANTIENE)
  const res = await fetch(`${BASE_URL}/api/standings/${categoryId}`);

  if (!res.ok) {
    throw new Error("Error obteniendo standings");
  }

  return res.json();
}